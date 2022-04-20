(function() {
    var botui =
        new BotUI(
            'recruitbot-window',
            { methods: { 'startFlow': function(text, flowName) {
                        botui.action.hide();
                        botui.message.add({
                            human: true,
                            content: text
                        }).then(startFlow(flowName));
                    }}});
    var user = {};
    var flows = {};

    function translateStuff(config) {
        var toTranslate = [];
        function recursiveGetter(json, parent, key) {
            if (_.isPlainObject(json)) {
                Object.getOwnPropertyNames(json).forEach(function(key) { recursiveGetter(json[key], json, key) });
            } else if (_.isArray(json)) {
                json.forEach(function(elem) { recursiveGetter(elem, json) });
            } else if (_.isString(json) && json.startsWith('chat.bot.')) {
                if (parent !== undefined && key !== undefined) {
                    toTranslate.push({ key: json, args: parent[key + '_args'] || [] });
                } else {
                    toTranslate.push({ key: json });
                }
            }
        }
        recursiveGetter(config);

        if (toTranslate.length === 0) {
            return $.when(config);
        } else {
            return $.ajax({
                method: "POST",
                url: "https://rbdemo.geniusminds.com/getMessage?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                data: JSON.stringify({ messages: toTranslate }),
                contentType: "application/json",
                dataType: 'json'
            }).then(function(obj) {
                function recursiveSetter(json, parent, key) {
                    if (_.isPlainObject(json)) {
                        Object.getOwnPropertyNames(json).forEach(function(key) { recursiveSetter(json[key], json, key) });
                    } else if (_.isArray(json)) {
                        json.forEach(function(elem) { recursiveSetter(elem, json) });
                    } else if (_.isString(json) && json.startsWith('chat.bot.')) {
                        parent[key] = obj.shift();
                    }
                }
                recursiveSetter(config);
                return config;
            });
        }
    }

    function concatenateElements(flow, args) {
        var values = [];
        translateStuff(_.cloneDeep(flow.elements).map(function(element) {
            if (typeof(element.config) === 'function') { element.config = element.config.apply(null, args); }
            return element;
        })).then(function(elements) {
            elements.reduce(function (accumulator, next) {
                return accumulator.then(function() {
                    if (next.type === 'action') {
                        return botui[next.type][next.subtype](next.config).then(function(value) {
                            values.push(value.value);
                            return $.when();
                        });
                    } else {
                        return botui[next.type][next.subtype](next.config);
                    }
                });
            }, $.when()).then(function() { flow.callback.apply(null, values); });
        })
    }

    function startFlow(flowName) {
        var args = arguments;
        var flow = flows[flowName];
        if (flow.showDialogue === true) {
            showDialogue();
        } else {
            hideDialogue();
        }
        return concatenateElements(flow, args);
    }

    flows = {


        initialize: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        delay: 500,
                        content: 'chat.bot.text.introduction'
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        delay: 1000,
                        content: 'chat.bot.text.login.or.register'
                    }
                },
                {
                    type: 'action',
                    subtype: 'button',
                    config: {
                        action: [
                            {
                                text: 'chat.bot.buttons.login',
                                value: 'login'
                            },
                            {
                                text: 'chat.bot.buttons.register',
                                value: 'register'
                            },
                            {
                                text: 'chat.bot.buttons.forgot.password',
                                value: 'forgot_password'
                            }
                        ]
                    }
                }
            ],
            callback: function(flowName) { return startFlow(flowName); }
        },
        register: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.register.info.required'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            sub_type: 'email',
                            placeholder: 'chat.bot.form.register.placeholder.your.email',
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'initialize'
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.register.password.required'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        addMessage: false,
                        action: {
                            minlength: 8,
                            sub_type: 'password',
                            placeholder: 'chat.bot.form.register.placeholder.your.password'
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        human: true,
                        content: '* * * * * *'
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.register.name.required'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            placeholder: 'chat.bot.form.register.first.name'
                        }
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            placeholder: 'chat.bot.form.register.last.name'
                        }
                    }
                }
            ],
            callback: function(email, password, firstname, lastname) {
                $.ajax({
                    type: 'POST',
                    url: 'https://rbdemo.geniusminds.com/register?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54',
                    data: JSON.stringify({'email': email, 'password': password, 'firstname': firstname, 'lastname': lastname}),
                    success: function(data) {
                        translateStuff({
                            content: 'chat.bot.text.register.activation.instructions',
                            content_args: [ firstname ]
                        }).then(function(config) {
                            return botui.message.add(config).then(startFlow('login'));
                        });
                    },
                    error: function() {
                        translateStuff({ content: 'chat.bot.text.register.failed' }).then(function(config) {
                            return botui.message.add(config).then(function() {
                                return translateStuff({ content: 'chat.bot.text.register.try.again' }).then(function(config) {
                                    return botui.message.add(config).then(startFlow('initialize'));
                                })
                            })
                        })
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            }
        },
        login: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.login.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            sub_type: 'email',
                            placeholder: 'chat.bot.form.login.placeholder.your.email',
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'initialize'
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.login.password.required'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        addMessage: false,
                        action: {
                            sub_type: 'password',
                            placeholder: 'chat.bot.form.login.placeholder.your.password'
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        human: true,
                        content: '* * * * * *'
                    }
                }
            ],
            callback: function(email, password) {
                $.ajax({
                    type: 'POST',
                    url: 'https://rbdemo.geniusminds.com/login?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54',
                    data: JSON.stringify({'email': email, 'password': password}),
                    success: function(data) {
                        user = data;
                        translateStuff({
                            content: 'chat.bot.text.login.successful',
                            content_args: [ user.firstName  ]
                        }).then(function(config) {
                            return botui.message.add(config).then(startFlow('main_menu'));
                        });
                    },
                    error: function(response) {
                        concatenateElements({
                            elements: response.responseJSON.response.map(function(text) { return { type: "message", subtype: "add", config: { content: text, type: "html", delay: 200 } }; }),
                            callback: function() { startFlow('initialize'); }
                        });
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            }
        },
        forgot_password: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.forgot.password.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            sub_type: 'email'
                        }
                    }
                }
            ],
            callback: function(email) {
                var formData = new FormData();
                formData.append('email', email);
                $.ajax({
                    type: 'POST',
                    url: 'https://rbdemo.geniusminds.com/password/forgot?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54',
                    data: formData,
                    processData: false,
                    contentType: false
                }).then(function() {
                    translateStuff({
                        content: 'chat.bot.text.forgot.password.done'
                    }).then(function(config) {
                        botui.message.add(config).then(startFlow('initialize'));
                    })
                });
            }
        },
        main_menu: {
            showDialogue: true,
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        delay: 100,
                        content: 'chat.bot.text.main.menu.introduction'
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        delay: 1000,
                        content: 'chat.bot.text.main.menu.choose.action'
                    }
                }
            ],
            callback: function() {}
        },
        bye: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.logout.bye'
                    }
                }
            ],
            callback: function() {
                $.ajax({
                    url: "https://rbdemo.geniusminds.com/admin/logout?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                    type: "GET",
                }).then(function() { return startFlow('initialize'); });
            }
        },
        job_search: {
            elements: [],
            callback: function() {
                translateStuff({
                    buttons: {
                        action: [
                            {
                                text: 'chat.bot.button.job.search.apply',
                                value: 'apply'
                            },
                            {
                                text: 'chat.bot.button.job.search.ignore',
                                value: 'ignore'
                            },
                            {
                                text: 'chat.bot.button.job.search.skip',
                                value: 'skip'
                            },
                            {
                                text: 'chat.bot.button.job.search.stop',
                                value: 'stop'
                            }
                        ]
                    },
                    applied: {
                        content: 'chat.bot.text.job.search.thanks.for.applying'
                    },
                    skipped: {
                        content: 'chat.bot.text.job.search.skipped.for.now'
                    },
                    ignored: {
                        content: 'chat.bot.text.job.search.ignored.forever'
                    },
                    stopped: {
                        content: 'chat.bot.text.job.search.stopped.search'
                    },
                    failure: {
                        content: 'chat.bot.buttons.failure'
                    },
                    upload_cv: {
                        content: 'chat.bot.text.job.search.please.upload.cv'
                    },
                    external_vacancy: {
                        header: 'chat.bot.text.job.search.external.vacancy.header',
                        description: 'chat.bot.text.job.search.external.vacancy.description',
                        description2: 'chat.bot.text.job.search.external.vacancy.description.2',
                        close: 'chat.bot.text.job.search.external.vacancy.close'
                    }
                }).then(function(configs) {
                    if (user.cv) {
                        $.ajax({
                            url: "https://rbdemo.geniusminds.com/findVacancies?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                            type: "POST",
                            data: JSON.stringify({}),
                            contentType: "application/json",
                            dataType: 'json',
                            success: function(data) {
                                var matches = data.best_matches;
                                function next() {
                                    if (matches.length === 0) {
                                        return startFlow('main_menu');
                                    } else {
                                        var content = matches.shift();
                                        return botui.message.add({
                                            delay: 500,
                                            type: 'html',
                                            content: content[1]
                                        }).then(function() {
                                            return botui.action.button(configs.buttons)
                                        }).then(function (res) {
                                            if (res.value === 'apply') {
                                                $.ajax({
                                                    url: "https://rbdemo.geniusminds.com/applyForVacancy/_insert_vacancy_id_here_?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54".replace("_insert_vacancy_id_here_", content[0]),
                                                    type: "POST",
                                                    data: JSON.stringify({}),
                                                    contentType: "application/json",
                                                    dataType: 'json',
                                                    success: function(data) {
                                                        var external = document.querySelector('a.external-application-link-' + content[0]);
                                                        if (external) {
                                                            $('<div class="modal" tabindex="-1" role="dialog">').append(
                                                                $('<div class="modal-dialog modal-dialog-centered" role="document">').append(
                                                                    $('<div class="modal-content">').append(
                                                                        $('<div class="modal-header">').append(
                                                                            $('<h5 class="modal-title"></h5>').text(configs.external_vacancy.header),
                                                                            $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')),
                                                                        $('<div class="modal-body">').append(
                                                                            $('<p>').text(configs.external_vacancy.description).append(' ', $('<a>').attr({ "href": external.href, "target": "_blank" }).append('<i class="fas fa-external-link-alt"></i>')),
                                                                            $('<p>').text(configs.external_vacancy.description2)),
                                                                        $('<div class="modal-footer">').append(
                                                                            $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>').text(configs.external_vacancy.close))))).on('hidden.bs.modal.modal', function(e) { $(e.target).remove(); botui.message.add(configs.applied).then(next); }).modal('show');
                                                        } else {
                                                            botui.message.add(configs.applied).then(next);
                                                        }
                                                    },
                                                    error: function(data) {
                                                        botui.message.add(configs.failure).then(next);
                                                    }
                                                });
                                            } else if (res.value === 'ignore') {
                                                $.ajax({
                                                    url: "https://rbdemo.geniusminds.com/ignoreVacancy/_insert_vacancy_id_here_?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54".replace("_insert_vacancy_id_here_", content[0]),
                                                    type: "POST",
                                                    data: JSON.stringify({}),
                                                    contentType: "application/json",
                                                    dataType: 'json',
                                                    success: function(data) {
                                                        botui.message.add(configs.ignored).then(next);
                                                    },
                                                    error: function(data) {
                                                        botui.message.add(configs.failure).then(next);
                                                    }
                                                });
                                            } else if (res.value === 'skip') {
                                                $.ajax({
                                                    url: "https://rbdemo.geniusminds.com/skipVacancy/_insert_vacancy_id_here_?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54".replace("_insert_vacancy_id_here_", content[0]),
                                                    type: "POST",
                                                    data: JSON.stringify({}),
                                                    contentType: "application/json",
                                                    dataType: 'json',
                                                    success: function(data) {
                                                        botui.message.add(configs.skipped).then(next);
                                                    },
                                                    error: function(data) {
                                                        botui.message.add(configs.failure).then(next);
                                                    }
                                                });
                                            } else {
                                                botui.message.add(configs.stopped).then(startFlow('main_menu'));
                                            }
                                        });
                                    }
                                }
                                translateStuff({
                                    content: 'chat.bot.text.job.search.found.n.vacancies',
                                    content_args: [ matches.length.toString() ]
                                }).then(function(config) {
                                    return botui.message.add(config);
                                }).then(next);
                            },
                            error: function() {
                                botui.message.add(configs.failure).then(startFlow('main_menu'));
                            }
                        });
                    } else {
                        botui.message.add(configs.upload_cv).then(startFlow('update_cv'));
                    }
                })
            }
        },
        show_status: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.status.intro'
                    }
                }
            ],
            callback: function() {
                translateStuff({
                    next_button: {
                        text: 'chat.bot.button.show.status.next',
                        value: 'next'
                    },
                    stop_button: {
                        text: 'chat.bot.button.show.status.stop',
                        value: 'stop'
                    },
                    cancel_button: {
                        text: 'chat.bot.button.show.status.cancel.application',
                        value: 'cancel'
                    },
                    ok: {
                        content: 'chat.bot.buttons.ok.thank.you'
                    },
                    failure: {
                        content: 'chat.bot.buttons.failure'
                    }
                }).then(function(configs) {
                    $.ajax({
                        url: "https://rbdemo.geniusminds.com/findApplications?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                        type: "GET",
                        dataType: 'json',
                        success: function(data) {
                            var applications = data.applications;
                            function next() {
                                if (applications.length === 0) {
                                    return startFlow('main_menu');
                                } else {
                                    var content = applications.shift();
                                    return botui.message.add({
                                        delay: 500,
                                        type: 'html',
                                        content: content[2]
                                    }).then(function() {
                                        var actions = [];
                                        if (applications.length > 0) {
                                            actions.push(configs.next_button);
                                        }
                                        if (content[1] === true) {
                                            actions.push(configs.cancel_button);
                                        }
                                        actions.push(configs.stop_button);
                                        return botui.action.button({ action: actions });
                                    }).then(function (res) {
                                        if (res.value === 'next') {
                                            next();
                                        } else if (res.value === 'cancel') {
                                            $.ajax({
                                                url: "https://rbdemo.geniusminds.com/cancelApplication/_insert_vacancy_id_here_?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54".replace("_insert_vacancy_id_here_", content[0]),
                                                type: "POST",
                                                data: JSON.stringify({}),
                                                contentType: "application/json",
                                                dataType: 'json',
                                                success: function(data) {
                                                    botui.message.add(configs.ok).then(next);
                                                },
                                                error: function(data) {
                                                    botui.message.add(configs.failure).then(next);
                                                }
                                            });
                                        } else {
                                            startFlow('main_menu');
                                        }
                                    });
                                }
                            }
                            translateStuff({
                                content: 'chat.bot.text.show.status.found.n.applications',
                                content_args: [ applications.length.toString() ]
                            }).then(function(config) {
                                return botui.message.add(config);
                            }).then(next);
                        },
                        error: function() {
                            botui.message.add(configs.failure).then(startFlow('main_menu'));
                        }
                    });
                })
            }
        },
        update_cv: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.update.cv.choose.a.file'
                    }
                },
                {
                    type: 'action',
                    subtype: 'file',
                    config: {
                        addMessage: false,
                        action: {
                            placeholder: 'chat.bot.form.update.cv.placeholder.your.cv',
                            button: {
                                label: 'Upload'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'main_menu'
                            }
                        }
                    }
                }
            ],
            callback: function(fileFormData) {
                botui.message.add({
                    human: true,
                    content: fileFormData.get('file').name
                }).then(function() {
                    return translateStuff({
                        working: {
                            content: "chat.bot.text.update.cv.working"
                        },
                        ok: {
                            content: 'chat.bot.buttons.ok.thank.you'
                        },
                        failure: {
                            content: 'chat.bot.buttons.failure'
                        }
                    });
                }).then(function(configs) {
                    return botui.message.add(configs.working).then(function() {
                        $.ajax({
                            url: "https://rbdemo.geniusminds.com/uploadCV?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                            type: "POST",
                            data: fileFormData,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                user = data;
                                botui.message.add(configs.ok).then(startFlow('main_menu'));
                            },
                            error: function() {
                                botui.message.add(configs.failure).then(startFlow('main_menu'));
                            }
                        })
                    });
                });
            }
        },
        motivation: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.motivation.introduction'
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        delay: 1000,
                        content: 'chat.bot.text.motivation.question.1'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: function(_flowName, oldValue1, oldValue2, oldValue3) {
                        return {
                            action: {
                                value: oldValue3 || '',
                                placeholder: 'chat.bot.form.motivation.placeholder.questions',
                                cssClass: 'form-control',
                                minlength: 50,
                                button: {
                                    label : 'chat.bot.buttons.ok'
                                },
                                backbutton: {
                                    label: 'chat.bot.buttons.back',
                                    flow: 'main_menu'
                                }
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.motivation.question.2'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: function(_flowName, oldValue1, oldValue2, oldValue3) {
                        return {
                            action: {
                                value: oldValue1 || '',
                                placeholder: 'chat.bot.form.motivation.placeholder.questions',
                                cssClass: 'form-control',
                                minlength: 50,
                                button: {
                                    label : 'chat.bot.buttons.ok'
                                },
                                backbutton: {
                                    label: 'chat.bot.buttons.back',
                                    flow: 'motivation'
                                }
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.motivation.question.3'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: function(_flowName, oldValue1, oldValue2, oldValue3) {
                        return {
                            action: {
                                value: oldValue2 || '',
                                placeholder: 'chat.bot.form.motivation.placeholder.questions',
                                cssClass: 'form-control',
                                minlength: 50,
                                button: {
                                    label : 'chat.bot.buttons.ok'
                                },
                                backbutton: {
                                    label: 'chat.bot.buttons.back',
                                    flow: 'motivation'
                                }
                            }
                        }
                    }
                }
            ],
            callback: function(motivation1, motivation2, motivation3) {
                translateStuff({
                    ok: {
                        content: 'chat.bot.buttons.ok.thank.you'
                    },
                    failure: {
                        content: 'chat.bot.text.motivation.failure'
                    }
                }).then(function(configs) {
                    $.ajax({
                        url: "https://rbdemo.geniusminds.com/uploadMotivation?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                        type: "POST",
                        data: JSON.stringify({ text: motivation1 + ' ' + motivation2 + ' ' + motivation3 }),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function() {
                            botui.message.add(configs.ok).then(startFlow('main_menu'));
                        },
                        error: function() {
                            botui.message.add(configs.failure).then(startFlow('motivation', motivation1, motivation2, motivation3));
                        }
                    });
                });
            }
        },
        change_settings: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: function() {
                        return {
                            content: 'chat.bot.text.settings.introduction',
                            content_args: [ user.location || 'chat.bot.text.settings.none.set', user.maxDistance ? user.maxDistance + ' km' : 'chat.bot.text.settings.none.set' ]
                        }
                    }
                },
                {
                    type: 'action',
                    subtype: 'button',
                    config: {
                        action: [
                            {
                                text: 'chat.bot.buttons.update.location',
                                value: 'update_location'
                            },
                            {
                                text: 'chat.bot.buttons.update.maximum.distance',
                                value: 'update_maximum_distance'
                            },
                            {
                                text: 'chat.bot.buttons.update.locale',
                                value: 'update_locale'
                            },
                            {
                                text: 'chat.bot.buttons.change.password',
                                value: 'change_password'
                            },
                            {
                                text: 'chat.bot.buttons.back',
                                value: 'main_menu'
                            }
                        ]
                    }
                }
            ],
            callback: function(flowName) { return startFlow(flowName); }
        },
        update_location: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.update.location.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            placeholder: 'chat.bot.form.update.location.placeholder.location',
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'change_settings'
                            }
                        }
                    }
                }
            ],
            callback: function(text) {
                translateStuff({
                    ok: {
                        content: 'chat.bot.buttons.ok.thank.you'
                    },
                    failure: {
                        content: 'chat.bot.text.update.location.failure'
                    }
                }).then(function(configs) {
                    $.ajax({
                        url: "https://rbdemo.geniusminds.com/updateLocation?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                        type: "POST",
                        data: JSON.stringify({ text: text }),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function(data) {
                            user = data;
                            botui.message.add(configs.ok).then(startFlow('change_settings'));
                        },
                        error: function() {
                            botui.message.add(configs.failure).then(startFlow('update_location'));
                        }
                    });
                });
            }
        },
        update_maximum_distance: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.update.radius.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        action: {
                            sub_type: 'number',
                            placeholder: '1 - 1000',
                            min: '1',
                            max: '1000',
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'change_settings'
                            }
                        }
                    }
                }
            ],
            callback: function(distance) {
                translateStuff({
                    ok: {
                        content: "chat.bot.buttons.ok.thank.you"
                    },
                    failure: {
                        content: "chat.bot.text.update.radius.failure"
                    }
                }).then(function(configs) {
                    $.ajax({
                        url: "https://rbdemo.geniusminds.com/updateMaxDistance?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                        type: "POST",
                        data: JSON.stringify({ maxDistance: distance.toString() }),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function(data) {
                            user = data;
                            botui.message.add(configs.ok).then(startFlow('change_settings'));
                        },
                        error: function() {
                            botui.message.add(configs.failure).then(startFlow('update_maximum_distance'));
                        }
                    });
                });
            }
        },
        update_locale: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.update.locale.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'button',
                    config: {
                        action: [
                            {
                                text: 'English',
                                value: 'en'
                            },
                            {
                                text: 'Nederlands',
                                value: 'nl'
                            },
                            {
                                text: 'chat.bot.buttons.back',
                                value: 'go_back'
                            }
                        ]
                    }
                }
            ],
            callback: function(locale) {
                if (locale === 'go_back') {
                    startFlow('change_settings')
                } else {
                    translateStuff({
                        ok: {
                            content: 'chat.bot.buttons.ok.thank.you'
                        },
                        failure: {
                            content: 'chat.bot.buttons.failure'
                        }
                    }).then(function(configs) {
                        $.ajax({
                            url: "https://rbdemo.geniusminds.com/changeLanguage?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54",
                            type: "POST",
                            data: JSON.stringify({ lang: locale }),
                            contentType: "application/json",
                            dataType: 'json',
                            success: function(data) {
                                user = data;
                                botui.message.add(configs.ok).then(startFlow('change_settings'));
                            },
                            error: function() {
                                botui.message.add(configs.failure).then(startFlow('change_settings'));
                            }
                        })
                    })
                }
            }
        },
        change_password: {
            elements: [
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        content: 'chat.bot.text.change.password.introduction'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        addMessage: false,
                        action: {
                            placeholder: 'chat.bot.form.change.password.placeholder.old.password',
                            sub_type: 'password',
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'change_settings'
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        human: true,
                        content: '* * * * * *'
                    }
                },
                {
                    type: 'action',
                    subtype: 'text',
                    config: {
                        addMessage: false,
                        action: {
                            placeholder: 'chat.bot.form.change.password.placeholder.new.password',
                            sub_type: 'password',
                            minlength: 8,
                            button: {
                                label : 'chat.bot.buttons.ok'
                            },
                            backbutton: {
                                label: 'chat.bot.buttons.back',
                                flow: 'change_settings'
                            }
                        }
                    }
                },
                {
                    type: 'message',
                    subtype: 'add',
                    config: {
                        human: true,
                        content: '* * * * * *'
                    }
                },
            ],
            callback: function(oldpassword, newpassword) {
                translateStuff({
                    ok: {
                        content: 'chat.bot.buttons.ok.thank.you'
                    },
                    failure: {
                        content: 'chat.bot.buttons.failure'
                    }
                }).then(function(configs) {
                    var formData = new FormData();
                    formData.append('current-password', oldpassword);
                    formData.append('new-password', newpassword);
                    $.ajax({
                        type: 'POST',
                        url: 'https://rbdemo.geniusminds.com/password/changeA?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54',
                        data: formData,
                        processData: false,
                        contentType: false
                    }).then(function(response) {
                        botui.message.add({
                            content: response.response
                        }).then(startFlow('change_settings'));
                    });
                })
            }
        }
    }



    startFlow('initialize');



    function showDialogue() {
        $(".card-chat .card-footer > *:first-child").fadeTo(1000, 1).find('input').focus();
    }
    function hideDialogue() {
        $(".card-chat .card-footer > *:first-child").fadeTo(500, 0).find('input').blur();
    }

    function sendMessage() {
        var message = $("#user-input-message").val();

        $.ajax({
            type: 'POST',
            url: 'https://rbdemo.geniusminds.com/message?csrfToken=191d2c99eb380af010be59aacadbaf8bb721b6e0-1568653531115-84d97a45b4f303d4a5bb2d54',
            data: JSON.stringify({'message': message}),
            success: function(data) {
                botui.message.add({
                    human: true,
                    content: message
                }).then(function () {
                    $.each(data["responses"], function (k, answer) {
                        botui.message.add({
                            content: answer["response"]
                        });
                    });

                    startFlow(data["state"]["latest_message"]["intent"]["name"]);

                    $("#user-input-message").val('');
                });
            },
            error: function() {
                $("#user-input-message").parent().addClass('has-error');
                setTimeout(function() {
                    $("#user-input-message").parent().removeClass('has-error');
                }, 3000);
            },
            contentType: "application/json",
            dataType: 'json'
        });
    }

    $("#send-message-btn").on('click', function() {
        sendMessage();
    });

    $('#user-input-message').on("keypress", function(e) {
        if (e.keyCode == 13) {
            sendMessage();
            return false;
        }
    });
})();