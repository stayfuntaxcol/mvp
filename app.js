import { firebaseConfig } from './firebase-config.js';
}


// --- Nominate ---
$('#formNominate').addEventListener('submit', async (e)=>{
e.preventDefault();
const user = auth.currentUser; if (!user) return;
const payload = {
cycleId: '2025', // simpel voor MVP
categoryId: $('#nmCategory').value,
personOrTeam: $('#nmName').value.trim(),
dept: $('#nmDept').value.trim(),
description: $('#nmWhy').value.trim(),
createdBy: user.uid,
ts: serverTimestamp()
};
await addDoc(collection(db,'nominees'), payload);
$('#nmOut').textContent = 'Nomination submitted!';
e.target.reset();
await loadNominees();
await loadNomineesForCategory(payload.categoryId);
});


// --- Vote (1 per category per user) ---
async function castVote(categoryId, nomineeId){
const user = auth.currentUser; if (!user) return;
const voteRef = doc(db, 'votes/2025/categories', categoryId, 'userVotes', user.uid);
await setDoc(voteRef, { nomineeId, ts: serverTimestamp() }, { merge: true });
$('#voteOut').textContent = `Your vote for category ${categoryId} was recorded.`;
}


// --- Kudos ---
$('#formKudos').addEventListener('submit', async (e)=>{
e.preventDefault();
const user = auth.currentUser; if (!user) return;
const payload = {
cycleId: '2025',
toId: $('#kdTo').value.trim(),
toType: 'person',
fromId: user.uid,
message: $('#kdMsg').value.trim(),
anon: $('#kdAnon').checked,
ts: serverTimestamp()
};
await addDoc(collection(db,'kudos'), payload);
$('#kdOut').textContent = 'Kudos posted!';
e.target.reset();
await loadKudos();
});


async function loadKudos(){
const list = $('#kudosList'); list.innerHTML='';
const qSnap = await getDocs(query(collection(db,'kudos'), orderBy('ts','desc')));
qSnap.forEach(d => {
const k = d.data();
const div = document.createElement('div'); div.className='card';
div.innerHTML = `<strong>To:</strong> ${k.toId} ${k.anon?'<span class="badge">anon</span>':''}<br/>${k.message}`;
list.appendChild(div);
});
}
