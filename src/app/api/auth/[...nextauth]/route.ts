import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string) {
  const salt = "spacecraft_salt_129847128";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "SpaceCraft Hesabı",
      credentials: {
        email: { label: "E-poçt Ünvanı", type: "email", placeholder: "test@spacecraft.test" },
        password: { label: "Şifrə", type: "password" },
        name: { label: "Adınız (Yeni qeydiyyat üçün)", type: "text", placeholder: "Məsələn: Həsən" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const hashedPassword = hashPassword(credentials.password);

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // Auto-create user on first login with password
          const displayName = credentials.name || email.split("@")[0];
          user = await prisma.user.create({
            data: {
              name: displayName,
              email: email,
              password: hashedPassword,
              image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
            }
          });
        } else {
          // If user exists, check if password is set
          if (!user.password) {
            // Set password on first credential login if they previously signed up without one
            user = await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword }
            });
          } else if (user.password !== hashedPassword) {
            throw new Error("Şifrə yanlışdır.");
          }
        }
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.picture = session.image || token.picture;
        if (session.twoFactorEnabled !== undefined) {
          token.twoFactorEnabled = session.twoFactorEnabled;
        }
        if (session.twoFactorEmailEnabled !== undefined) {
          token.twoFactorEmailEnabled = session.twoFactorEmailEnabled;
        }
        if (session.twoFactorSmsEnabled !== undefined) {
          token.twoFactorSmsEnabled = session.twoFactorSmsEnabled;
        }
        if (session.twoFactorAuthenticatorEnabled !== undefined) {
          token.twoFactorAuthenticatorEnabled = session.twoFactorAuthenticatorEnabled;
        }
        if (session.twoFactorPhone !== undefined) {
          token.twoFactorPhone = session.twoFactorPhone;
        }
      }
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { 
            name: true, 
            image: true, 
            subscriptionStatus: true, 
            twoFactorEnabled: true,
            twoFactorEmailEnabled: true,
            twoFactorSmsEnabled: true,
            twoFactorAuthenticatorEnabled: true,
            twoFactorPhone: true,
            twoFactorSecret: true
          }
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.subscriptionStatus = dbUser.subscriptionStatus;
          token.twoFactorEnabled = dbUser.twoFactorEnabled;
          token.twoFactorEmailEnabled = dbUser.twoFactorEmailEnabled;
          token.twoFactorSmsEnabled = dbUser.twoFactorSmsEnabled;
          token.twoFactorAuthenticatorEnabled = dbUser.twoFactorAuthenticatorEnabled;
          token.twoFactorPhone = dbUser.twoFactorPhone;
          token.twoFactorSecret = dbUser.twoFactorSecret;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.subscriptionStatus = token.subscriptionStatus;
        session.user.twoFactorEnabled = token.twoFactorEnabled;
        session.user.twoFactorEmailEnabled = token.twoFactorEmailEnabled;
        session.user.twoFactorSmsEnabled = token.twoFactorSmsEnabled;
        session.user.twoFactorAuthenticatorEnabled = token.twoFactorAuthenticatorEnabled;
        session.user.twoFactorPhone = token.twoFactorPhone;
        session.user.twoFactorSecret = token.twoFactorSecret;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret"
};

const handler = NextAuth(authOptions);

async function authHandler(req: any, context: any) {
  const params = await context.params;
  return handler(req, { ...context, params });
}

export { authHandler as GET, authHandler as POST };
