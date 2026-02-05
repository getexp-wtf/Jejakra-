import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/index.js';
import { env } from '../../config/index.js';
import type { JwtPayload } from '../../types.js';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    const err = new Error('Invalid credentials') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    const err = new Error('Invalid credentials') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email } as JwtPayload,
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    user: toUserResponse(user),
    token,
  };
}

export async function register(data: { email: string; password: string; name?: string; role?: string }) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (existing) {
    const err = new Error('Email already registered') as Error & { status: number };
    err.status = 409;
    throw err;
  }

  const passwordHash = await argon2.hash(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name ?? 'New User',
      role: (data.role as 'doctor' | 'user' | 'admin') ?? 'user',
    },
  });

  const token = jwt.sign(
    { sub: user.id, email: user.email } as JwtPayload,
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    user: toUserResponse(user),
    token,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  return toUserResponse(user);
}

export async function updateProfile(userId: string, data: { name?: string; avatar?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    },
  });
  return toUserResponse(user);
}

function toUserResponse(user: { id: string; email: string; name: string; role: string; avatar: string | null }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}
