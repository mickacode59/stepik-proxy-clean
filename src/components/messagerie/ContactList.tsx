import React from 'react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelect }) => (
  <div className="w-full max-w-xs bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 overflow-y-auto h-full">
    <h3 className="font-bold text-lg mb-4">Contacts</h3>
    <ul>
      {contacts.map(c => (
        <li key={c.id} className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-2" onClick={() => onSelect(c.id)}>
          <span className={`w-3 h-3 rounded-full ${c.online ? 'bg-green-500' : 'bg-gray-400'} mr-2`} />
          <img src={c.avatar} alt="avatar" className="w-8 h-8 rounded-full border" />
          <span className="font-medium">{c.name}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ContactList;
