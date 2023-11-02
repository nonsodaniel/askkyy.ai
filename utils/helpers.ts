import { firebaseApp } from "@/lib/firebaseConfig";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
const db = getFirestore(firebaseApp);
export const saveResponseToFirebase = async (
  requestData: any,
  type: string
) => {
  try {
    await setDoc(doc(db, type, requestData.id.toString()), requestData);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const fetchResponseFromFirebase = async (
  userId: string,
  type: string
) => {
  try {
    const q = query(collection(db, type), where("createdBy", "==", userId));

    const querySnapshot = await getDocs(q);

    const dataList: any = [];
    querySnapshot.forEach((doc) => {
      dataList.push(doc.data());
    });
    return dataList;
  } catch (error) {
    console.error(error);
  } finally {
  }
};
