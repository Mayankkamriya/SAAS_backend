import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  );
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  
  try {
     if (!name || !email || !password) {
      res.status(400).json({ error: "Please provide all fields." });
      return; // Important: stop execution
    }

      // ✅ Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "Email already registered. Please use a different email." });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role?.toUpperCase() || 'USER' // Set role if provided
      }
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
    return;
  
  }
};



export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user ) {
    res.status(403).json({ message: "user not found" });
    return 
  }
  if ( user.role !== "USER") {
    res.status(403).json({ message: "Access denied" });
    return 
  }

  const isValid = await bcrypt.compare(password, user.password || "");
  if (!isValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return 
  }

  const token = generateToken(user);
  res.json({ token, user });
};