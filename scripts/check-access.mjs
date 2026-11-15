// Optional LIVE RLS verification against a Supabase test project.
// Use two dedicated, confirmed disposable users. No service-role key is used.
import { existsSync } from 'node:fs';
if(existsSync('.env.access.local'))process.loadEnvFile('.env.access.local');
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const required=['TEST_USER_A_EMAIL','TEST_USER_A_PASSWORD','TEST_USER_B_EMAIL','TEST_USER_B_PASSWORD'];
if(!url||!key||required.some(k=>!process.env[k]))throw Error('Set the project values and two disposable test user credentials in .env.access.local. See BACKEND_SETUP.md.');
async function request(endpoint,{method='GET',token=key,data}={}){
 const response=await fetch(url+endpoint,{method,headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json',Prefer:'return=representation'},body:data===undefined?undefined:JSON.stringify(data)});
 const value=await response.json().catch(()=>null);return {ok:response.ok,status:response.status,value};
}
function assert(value,message){if(!value)throw Error('FAIL: '+message);console.log('PASS: '+message);}
async function login(which){const result=await request('/auth/v1/token?grant_type=password',{method:'POST',data:{email:process.env[`TEST_USER_${which}_EMAIL`],password:process.env[`TEST_USER_${which}_PASSWORD`]}});if(!result.ok)throw Error('Test account '+which+' could not sign in. Confirm its email first.');return {id:result.value.user.id,token:result.value.access_token};}
const a=await login('A'),b=await login('B');
assert(a.id!==b.id,'two separate test accounts');
let result=await request('/rest/v1/profiles?select=id');assert(!result.ok||result.value.length===0,'anonymous users cannot read profiles');
const makeProfile=id=>({id,name:'Disposable RLS test',program:'Test program',onboarding_complete:true});
for(const user of [a,b]){result=await request('/rest/v1/profiles?on_conflict=id',{method:'POST',token:user.token,data:makeProfile(user.id)});if(result.status===409)continue;assert(result.ok,'test profile is writable by its owner');}
result=await request(`/rest/v1/profiles?id=eq.${a.id}`,{token:b.token});assert(result.ok&&result.value.length===0,'user B cannot read user A profile');
result=await request(`/rest/v1/profiles?id=eq.${a.id}`,{method:'PATCH',token:b.token,data:{name:'Not allowed'}});assert(!result.ok||result.value.length===0,'user B cannot edit user A profile');
result=await request(`/rest/v1/saved_courses?user_id=eq.${a.id}`,{token:b.token});assert(result.ok&&result.value.length===0,'user B cannot read user A saved courses');
const marker='RLS test '+Date.now();let created;
try{
 result=await request('/rest/v1/course_reviews',{method:'POST',token:a.token,data:{course_code:'CSCI 544',author_id:a.id,semester:marker,instructor:'',difficulty:3,assessments:'Disposable test',workload:'Disposable test',grade:'',advice:'Original test advice'}});assert(result.ok,'owner can create a review');created=result.value[0].id;
 result=await request(`/rest/v1/course_reviews?id=eq.${created}`,{method:'PATCH',token:b.token,data:{advice:'Unauthorized change'}});assert(!result.ok||result.value.length===0,'another user cannot edit the review');
 result=await request(`/rest/v1/course_reviews?id=eq.${created}`,{method:'DELETE',token:b.token});assert(!result.ok||result.value.length===0,'another user cannot delete the review');
 result=await request(`/rest/v1/course_reviews?id=eq.${created}`,{token:a.token});assert(result.value?.[0]?.advice==='Original test advice','foreign writes did not alter the review');
 result=await request('/rest/v1/course_reviews?source_kind=eq.imported&limit=1',{token:a.token});assert(result.ok&&result.value.length===1,'imported reviews are readable to signed-in students');const imported=result.value[0].id;
 result=await request(`/rest/v1/course_reviews?id=eq.${imported}`,{method:'PATCH',token:a.token,data:{advice:'Not allowed'}});assert(!result.ok||result.value.length===0,'students cannot modify imported review records');
 result=await request('/rest/v1/profile_templates',{method:'POST',token:a.token,data:{id:'not-allowed',label:'test'}});assert(!result.ok,'students cannot create template identities');
}finally{if(created)await request(`/rest/v1/course_reviews?id=eq.${created}`,{method:'DELETE',token:a.token});}
console.log('Access checks completed. Delete the two disposable auth users in Supabase to remove their test profiles.');
