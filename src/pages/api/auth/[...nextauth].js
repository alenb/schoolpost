import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: "auth",
		collections: {
			Accounts: "accounts",
			Users: "users",
			Sessions: "sessions",
			VerificationTokens: "verification_tokens",
		},
	}),
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = profile.sub;
			}
			return token;
		},
		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			session.user.id = token.sub;
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	debug: false,
});
