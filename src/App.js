import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import React, { useRef, useState } from 'react';

import { StandardChart } from './Charts';
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCQAIqj4r4x5lu01iktmJkWQgnA-qYjaOw",
  authDomain: "finance-manager-baf55.firebaseapp.com",
  projectId: "finance-manager-baf55",
  storageBucket: "finance-manager-baf55.appspot.com",
  messagingSenderId: "977205835382",
  appId: "1:977205835382:web:a9b78ad9671e2983409157"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Finance-Manager</h1>
        <SignOut />
      </header>

      <section>
        {user ? <FinanceTracker /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function FinanceTracker() {
  const bucketsRef = firestore.collection('bucket');
  const query = bucketsRef.orderBy('bankDesc').limit(25);

  const [buckets] = useCollectionData(query, { idField: 'id' });

  return (<>
    <main>

      {buckets && buckets.map(bucket => <BucketDisplay key={bucket.id} bucket={bucket} />)}

    </main>
  </>)
}

function BucketDisplay(props) {
  const {amounts, bankCode, bank} = props.bucket

  amounts.forEach((amount,i) => {
        amount.date = amount.date.toDate().toString();
  });
  
  console.log(amounts)

  return (
    <div>
      <h1>{bank}</h1>
      <StandardChart data={amounts} />
    </div>
  )
}

export default App;