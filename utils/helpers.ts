import { firebaseApp } from "@/lib/firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
const db = getFirestore(firebaseApp);

export const saveResponseToFirebase = async (
  requestData: any,
  type: string
) => {
  try {
    console.log("remi", requestData);
    await setDoc(doc(db, type, requestData.id.toString()), requestData);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
