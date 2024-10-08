import { NextApiRequest, NextApiResponse } from "next";

// Authentication
export interface AuthenticateRequest extends NextApiRequest {
  body: {
    idToken: string;
  };
}

export interface AuthenticateResponse  {
  auth_token: string;
}

// User
export interface CreateUserRequest extends NextApiRequest {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface CreateUserResponse extends NextApiResponse {
  id: string;
  name: string;
  email: string;
}

// Transaction
export interface CreateTransactionRequest extends NextApiRequest {
  body: {
    amount: number;
    currency: string;
    description: string;
    userId: string;
  };
}

export interface CreateTransactionResponse {
  id: string;
  amount: number;
  currency: string;
  description: string;
  userId: string;
  createdAt: string;
}

// Generic error response
export interface ErrorResponse {
  error: string;
}