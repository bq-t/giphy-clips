import{_ as v}from"./VideoCard.scss_vue_type_style_index_0_src_true_lang-B3OTdAip.js";import{u as g}from"./useMockApi-gST0Mk85.js";import{u as h}from"./useThrottle-aDuC7O3A.js";import{d as y,r as c,o as k,j as w,H as B,c as l,k as r,b as z,B as C,F as S,p as x,D,q as F,e as o,y as I}from"./index-BdAOosat.js";const N={class:"favorites-page"},V={class:"favorites-page__heading"},A={class:"favorites-page__grid"},H=y({__name:"favorites",setup(E){const u=g(),{getFavorites:_}=u,t=c([]),a=c(0);k(()=>n());const n=()=>{_(a.value).then(e=>{if(!Array.isArray(e))throw new Error("Invalid response format");t.value.push(...e),a.value+=18})},d=h(e=>{!e.isIntersecting||!t.value.length||n()},300);return(e,i)=>{const p=w("gc-icon"),f=B("intersect");return o(),l("div",N,[r("h1",V,[z(p,{class:"favorites-page__heading-icon",name:"favorite-outline"}),i[0]||(i[0]=C(" Your favorites: "))]),r("div",A,[(o(!0),l(S,null,x(t.value,(s,m)=>(o(),I(v,{key:m,id:s.id,to:{name:"clips-clipSlug",params:{clipSlug:s.slug}},src:s.images.downsized.url,"lazy-src":s.images.downsized.url},null,8,["id","to","src","lazy-src"]))),128)),D(r("div",null,null,512),[[f,F(d)]])])])}}});export{H as default};
