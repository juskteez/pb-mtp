  // Unchanged variable
  //var fadeTime = 600; // Slide duration

  // HTML tag generator
  function tGen(tag, id, cLass, content, custCSS, specAttr) {

    // Create some default variables
    var Aid = '',
      AcLass = '',
      cCSS = '',
      sAttr = '';

    // First get the tag name, if there's no tag name so there will be nothing
    if (tag != undefined && tag != '') {
      if (id != undefined && id != '') {
        Aid = ' id="' + id + '"';
      } // Check id availability and add it to the tag
      if (cLass != undefined && cLass != '') {
        AcLass = ' class="' + cLass + '"';
      } // Check class availability and add it to the tag
      if (content == undefined) {
        content = ''
      } // Check content availability and add it to the tag
      if (!custCSS != undefined && !custCSS != '') {
        custCSS = ''
      } else {
        cCSS = ' style="' + custCSS + '"'
      } // Check css availability and add it to the tag
      if (!specAttr != undefined && !specAttr != '') {
        specAttr = ''
      } else {
        sAttr = ' ' + specAttr
      } // Check custom attributes availability and add it to the tag
      return '<' + tag + Aid + AcLass + cCSS + sAttr + '>' + content + '</' + tag + '>'; // Final tag generated
    } else {
      return ''
    }
  }

  // CSS animation generator for this plugin
  function aGen(the_selector, animation_name, delay_time, animation_duration, property, aValue, bValue, css3, aExP, bExP, revert, reVal) {

    // Check availability of basic value
    if (the_selector != undefined && the_selector != '' && property != undefined && property != '' && aValue != undefined && aValue != '' && bValue != undefined && bValue != '') {

      // Some default variables
      var pfx = ["-webkit-", ""], // pfx = ["-webkit-", "-moz-", "-ms-", "-o-", ""]
        i, animations = '/* ' + animation_name + ' effect */\n',
        xpfx = '';

      if (aExP == undefined) {
        aExP = ''
      } // Replace undefined extend properties A
      if (bExP == undefined) {
        bExP = ''
      } // Replace undefined extend properties B

      animations += the_selector + ' {\n';

      for (i = 0; i < pfx.length; i++) {
        // Declare animations
        animations += pfx[i] + 'animation: ani_' + animation_name + ' ' + animation_duration + 's cubic-bezier(.53,.08,.04,.94) forwards;\n';
        animations += pfx[i] + 'animation-delay: ' + delay_time + 's;\n';
      }
      animations += '}\n\n'; // Close the declare

      for (i = 0; i < pfx.length; i++) {

        if (css3) {
          xpfx = pfx[i]
        } // Determine CSS3 property
        animations += '@' + pfx[i] + 'keyframes ani_' + animation_name + ' {'; // Open keyframes
        animations += '0% {' + xpfx + property + ':' + aValue + ';' + aExP + '}'; // Start animation
        animations += ' 100% {' + xpfx + property + ':' + bValue + ';' + bExP + '}'; // End animation
        animations += '}\n'; // Close keyframes

      }

      // Create a revert animation if it's needed
      if (revert) {

        animations += '\n' + the_selector + ' {\n'; // Open the declare

        for (i = 0; i < pfx.length; i++) {
          // Declare reverted animations
          animations += pfx[i] + 'animation: ani_' + animation_name + '_r ' + animation_duration + 's cubic-bezier(.53,.08,.04,.94) forwards;\n';
          animations += pfx[i] + 'animation-delay: ' + delay_time + 's;\n';
        }
        animations += '}\n\n'; // Close the declare
        for (i = 0; i < pfx.length; i++) {

          if (css3) {
            xpfx = pfx[i]
          } // Determine CSS3 property
          if (reVal) {
            cValue = '-' + aValue
          } else {
            cValue = aValue
          } // Determine revert value
          animations += '@' + pfx[i] + 'keyframes ani_' + animation_name + '_r {'; // Open keyframes
          animations += '0% {' + xpfx + property + ':' + bValue + ';' + bExP + '}'; // Start animation
          animations += ' 100% {' + xpfx + property + ':' + cValue + ';' + aExP + '}'; // End animation
          animations += '}\n'; // Close keyframes

        }
      }
      return animations + '\n'; // Final animation CSS
    }
  }

  //console.log(aGen('.home_roadmap.active .roadmap_chart_pointer:nth-of-type(10) .rm_prg', 'rm_prg_10', 1.7 , 'height', '10px', '100%', false, '', '', false, false));

  var total_animations = '',
    allProgress = document.querySelectorAll('.roadmap_chart_progress.rm_prg');

  for (i=1;i<=allProgress.length;i++) {
    var thisProgress = allProgress[(i-1)],
      thisTargetPoint = thisProgress.getAttribute('target-point'),
      thisTargetValue = thisProgress.getAttribute('target-value');

    total_animations += aGen('.home_roadmap.active .roadmap_chart_pointer:nth-of-type(' + i + ') .rm_prg', 'rm_prg_' + i, 1.7 , 1.2, 'height', '10px', thisTargetPoint, false, '', '', false, false);
  }

  //console.log(total_animations);

  // Animations list
  /*var jLanis = aGen('fade', 'opacity', '0', '1', false) +
    aGen('slide', 'left', '100%', '0%', false, 'opacity: 0', 'opacity: 1', true, true) +
    aGen('scaleIn', 'transform', 'scale(0)', 'scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('scaleOut', 'transform', 'scale(1.4)', 'scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('flipPersL', 'transform', 'perspective(400px) rotateY(-57deg) scale(0.4)', 'perspective(400px) rotateY(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('flipPersR', 'transform', 'perspective(400px) rotateY(57deg) scale(0.4)', 'perspective(400px) rotateY(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('flipPersU', 'transform', 'perspective(400px) rotateX(57deg) scale(0.4)', 'perspective(400px) rotateX(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('flipPersD', 'transform', 'perspective(400px) rotateX(-57deg) scale(0.4)', 'perspective(400px) rotateX(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('rotateL', 'transform', 'rotate(180deg) scale(0.4)', 'rotate(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
    aGen('rotateR', 'transform', 'rotate(-180deg) scale(0.4)', 'rotate(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true);*/

  // Create a style tag in head contain animations created in the list
  //$('head').append(tGen('style', 'jLstyle', '', jLanis));
