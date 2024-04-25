import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // Connect to socket server
  useEffect(() => {
    try{
      const newSocket = io('http://localhost:5000',
      {
        reconnectionAttempts: 1
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }catch(e){
      console.log(e)
    }
  }, [setSocket]);

  // Listen for messages from the server
  useEffect(() => {
    if (socket) {
      socket.on('message', message => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket]);

  // Function to send a message to the server
  const sendMessage = () => {
    let data = {
      "label_name": "pos_label_new",
      "data": {
        BillNo: "PS001",
        Date: "12-01-2024",
        Name: "TEST PV",
        Mobile: "9632587410",
        items: [
          {
            sno: 1,
            Name: "TEST 01",
            qty: 3,
            rate: 400,
            Amount: 300
          }
        ],
        TotalItem: 4,
        TotalAmount: 2000,
        discount: "0.00",
        BillingAddress: '',
        Taxkey: '',
        TaxAmount: '',
        TotalAfterDiscount: '',
        Total: 1000,
        TaxInvoice: '',
        Gst: 'ESTIMATE'
      }
    }    
    if (socket) {
      socket.emit("print-data", data);
      socket.emit('message', 'Hello from React!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Socket Client</h1>
        <button onClick={sendMessage}>Send Message</button>
        <div>
          <h2>Messages:</h2>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
