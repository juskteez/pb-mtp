$(document).ready(function(){function t(t,e,r,o,a){var i=o.split(/(\s+)/).filter(function(t){return t.trim().length>0}),n="",s=a-e,d=0,c=0;return d=s<0?0:s>=r?r:s,c=d/r*100,$.each(i,function(e){var r=i[e].split(",")[1],o=i[e].split(",")[0],a=r-t,s=a*(c/100);n+=r==-1e-4||r==undefined?r==undefined?" "+o:" "+o+","+r:" "+o+","+(t+s)}),n}$(window).scroll(function(){var e=$(window).scrollTop(),r=$("#motion_paths").offset().top-$(window).height()/1.5,o=r,a=600,n=44,s=e-o,d=0,c=$(".motion_dots .motion_single_dot"),l=$("svg.motion_path","#motion_paths");for(i=0;i<l.length;i++){var v=l.eq(i),h=v.children(".the_clip_motion"),m=h.data("target-d"),g=Number(v.data("motion-baseline")),u=v.prop("id");h.attr("d",t(g,r,600,m,e,u))}d=s<0?0:s>=a?a:e-o;var f=Math.round(d/a*100);for(i=0;i<c.length;i++){var v=c.eq(i),p=v.data("o-cy"),g=v.parent().data("motion-base"),_=p-n,w=_*(f/100);v.attr("cy",n+w)}})});