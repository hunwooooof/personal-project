import { DocumentData, DocumentReference } from 'firebase/firestore';

export interface UserType {
  photoURL?: string;
  email?: string;
  kids?: DocumentReference<DocumentData, DocumentData>[];
  ordersRef?: DocumentReference<DocumentData, DocumentData>[];
  displayName?: string | undefined;
  phoneNumber?: string;
  registrationDate?: string;
  role?: string;
}

export interface AllDatesType {
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface DetailType {
  address: string;
  date: string;
  tag?: string;
  time: string;
  title: string;
}

export interface AdminOrderType {
  id: string;
  userRef: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId: string;
    firstName: string;
    lastName: string;
  };
  plan: '01' | '08' | '10' | '12';
  method: 'cash' | 'tran';
  status: 'SUCCESS' | 'IN_PROCESS' | 'FAILED';
  timestamp: {
    seconds: number;
  };
  price: 1000 | 7200 | 8250 | 9000;
}

export interface OrderType {
  id?: string;
  userRef?: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId?: string;
    firstName?: string;
    lastName?: string;
  };
  plan?: '01' | '08' | '10' | '12';
  method?: 'cash' | 'tran';
  status?: 'SUCCESS' | 'IN_PROCESS';
  timestamp: {
    seconds: number;
  };
  price?: 1000 | 7200 | 8250 | 9000;
}

export interface MessageType {
  timestamp: number;
  content: string;
  sender: string;
}

export interface VideoType {
  tag: string;
  date: string;
  title: string;
  youtubeId: string;
  type?: string;
}

export interface NewVideoType {
  tag: string;
  date: string;
  title: string;
  youtubeLink: string;
  type?: string;
}

export interface KidType {
  birthday: string;
  chineseName: string;
  docId: string;
  firstName: string;
  id: string;
  lastName: string;
  photoURL: string;
  school: string;
}
