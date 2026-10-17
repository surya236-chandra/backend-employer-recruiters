import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const users = [];

export const User = {
  async create({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(user => user.email === normalizedEmail)) throw new Error('An account with this email already exists.');
    const user = { id: randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), createdAt: new Date() };
    users.push(user);
    return this.publicUser(user);
  },
  async authenticate(email, password) {
    const user = users.find(item => item.email === email.trim().toLowerCase());
    return user && await bcrypt.compare(password, user.passwordHash) ? this.publicUser(user) : null;
  },
  findById(id) { const user = users.find(item => item.id === id); return user ? this.publicUser(user) : null; },
  publicUser({ id, name, email }) { return { id, name, email }; }
};
