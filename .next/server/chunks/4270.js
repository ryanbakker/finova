"use strict";exports.id=4270,exports.ids=[4270],exports.modules={84270:(a,b,c)=>{c.d(b,{clerkDevelopmentCache:()=>g,createConfirmationMessage:()=>f,createKeylessModeMessage:()=>e});var d=c(76064);let e=a=>`
\x1b[35m
[Clerk]:\x1b[0m You are running in keyless mode.
You can \x1b[35mclaim your keys\x1b[0m by visiting ${a.claimUrl}
`,f=()=>`
\x1b[35m
[Clerk]:\x1b[0m Your application is running with your claimed keys.
You can safely remove the \x1b[35m.clerk/\x1b[0m from your project.
`,g=function(){if((0,d.b_)())return global.__clerk_internal_keyless_logger||(global.__clerk_internal_keyless_logger={__cache:new Map,log:function({cacheKey:a,msg:b}){var c;this.__cache.has(a)&&Date.now()<((null==(c=this.__cache.get(a))?void 0:c.expiresAt)||0)||(console.log(b),this.__cache.set(a,{expiresAt:Date.now()+6e5}))},run:async function(a,{cacheKey:b,onSuccessStale:c=6e5,onErrorStale:d=6e5}){var e,f;if(this.__cache.has(b)&&Date.now()<((null==(e=this.__cache.get(b))?void 0:e.expiresAt)||0))return null==(f=this.__cache.get(b))?void 0:f.data;try{let d=await a();return this.__cache.set(b,{expiresAt:Date.now()+c,data:d}),d}catch(a){throw this.__cache.set(b,{expiresAt:Date.now()+d}),a}}}),globalThis.__clerk_internal_keyless_logger}()}};