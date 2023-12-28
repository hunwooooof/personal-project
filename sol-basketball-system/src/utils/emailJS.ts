import emailjs from '@emailjs/browser';
import { DocumentReference } from 'firebase/firestore';

interface OrderType {
  userRef: DocumentReference | undefined;
  kid: {
    docId: string;
    firstName: string;
    lastName: string;
  };
  plan: string;
  method: string;
  status: string;
  time: string;
  price: number;
}

const email = {
  notifyNewOrder: async (order: OrderType, orderId: string, displayName: string) => {
    const orderParams = {
      name: displayName,
      orderId: orderId,
      kidFirstName: order.kid.firstName,
      kidLastName: order.kid.lastName,
      time: order.time,
      plan: `${parseInt(order.plan)} session(s)`,
      price: `$${order.price}`,
      method: order.method === 'cash' ? 'by cash' : 'online transfer',
    };
    const response = await emailjs.send(
      'gmail_solbasketball',
      'new_order_notification',
      orderParams,
      'ACUpqBF5BjezNnuMd',
    );
    if (response) console.log(response.status, response.text);
  },
  orderCreate: async (order: OrderType, orderId: string, displayName: string, confirmedEmail: string) => {
    const orderParams = {
      to_email: confirmedEmail,
      name: displayName,
      orderId: orderId,
      kidFirstName: order.kid.firstName,
      kidLastName: order.kid.lastName,
      time: order.time,
      plan: `${parseInt(order.plan)} session(s)`,
      price: `$${order.price}`,
      method: order.method === 'cash' ? 'by cash' : 'online transfer to (808) 0624-979-171404',
    };
    const response = await emailjs.send(
      'gmail_solbasketball',
      'order_create_to_client',
      orderParams,
      'ACUpqBF5BjezNnuMd',
    );
    if (response) console.log(response.status, response.text);
  },
};

export default email;
