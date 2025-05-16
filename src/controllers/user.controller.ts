import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from "bcryptjs";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {

  if (!name || !email || !password) {
    res.status(400).json({ error: "Please fill in all the fields: name, email, and password are required." });
  }

const hashedPassword = await bcrypt.hash(password, 4);

    const user = await prisma.user.create({
  data: {
    name: name,
    email: email,
    password: hashedPassword,
  },
})
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};
