"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6 ">
          <div className="flex items-center gap-1 mb-6">
            <Image
              src="/logo_lampinvite.webp"
              alt="LampInvite"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span
              className="text-xl"
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontWeight: 800,
              }}
            >
              <span style={{ color: "#1e1b4b" }}>Lamp</span>
              <span style={{ color: "#F97316" }}>Invite</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Crie sua conta grátis ⚡" : "Bem-vindo de volta 👋"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isSignUp ? "Pronto em segundos" : "Entre na sua conta LampInvite"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("Verifique")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            {loading ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="w-full text-sm py-1"
          >
            {isSignUp ? (
              <>
                <span className="text-gray-500">Já tem conta? </span>
                <span className="text-orange-500 hover:text-orange-600 font-semibold">
                  Entrar
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-500">Não tem conta? </span>
                <span className="text-orange-500 hover:text-orange-600 font-semibold">
                  Criar conta
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
