"use client";
import { useState } from "react";
import styles from "./signup.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  toastAviso,
  toastErro,
} from "../../components/toasts/toastsPersonalizados";

export default function Signup() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createUser() {
    if (name.length < 3 || name.length > 255) {
      toastErro(
        "Seu nome deve possuir mais do que 3 caracteres e menos do que 255 caracteres",
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toastErro("Por favor, insira um e-mail válido");
      return;
    } else if (!/[A-Z]/.test(password)) {
      toastErro(
        "Sua senha deve possuir pelo menos 8 caracteres, uma letra minuscula[a-z], uma maiuscula[A-Z], um numero[0-9] e um caractere especial[!@#$%^&*]",
      );
      return;
    } else if (password != confirmPassword) {
      toastErro("Senha e confirmar senha estão diferentes");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      if (image) {
        formData.append("foto", image);
      }
      formData.append("nome", name);
      formData.append("email", email);
      formData.append("senha", password);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          body: formData,
        },
      );

      const dados = await response.json();

      if (!response.ok) {
        toastErro(dados.erro);
        return;
      }
      toastAviso("Um token de verificação foi enviado para a sua conta");
      router.push("/signin");
    } catch (error) {
      console.error(error);
      toastErro("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Focus Flow</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/signin" className={styles.btnLink}>
            Já tenho conta
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
          className={styles.card}
        >
          <h1 className={styles.title}>Criar conta</h1>

          <label className={styles.photo}>
            {!preview ? (
              <span>Adicionar foto</span>
            ) : (
              <img src={preview} alt="Pré-visualização da foto" />
            )}

            <input
              accept="image/*"
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImage(file);

                if (preview) {
                  URL.revokeObjectURL(preview);
                }
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  return;
                }
                setPreview(null);
              }}
            />
          </label>

          <div className={styles.field}>
            <Input
              textLabel="Usuario"
              type="text"
              placeholder="Insira um nome de usuário"
              value={name}
              id="name"
              setValue={setName}
              required
            />
          </div>

          <div className={styles.field}>
            <Input
              textLabel="Email"
              type="text"
              placeholder="Insira seu e-mail"
              value={email}
              id="email"
              setValue={setEmail}
              required
            />
          </div>

          <div className={styles.field}>
            <Input
              textLabel="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Insira uma senha"
              value={password}
              id="password"
              setValue={setPassword}
              required
              icon={
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="icon"
                  className={styles.iconButton}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              }
            />
          </div>

          <div className={styles.field}>
            <Input
              textLabel="Confirmar senha"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Digite a mesma senha"
              value={confirmPassword}
              id="confirmPassword"
              setValue={setConfirmPassword}
              required
              icon={
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="icon"
                  className={styles.iconButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              }
            />
          </div>

          <Button
            className={styles.btnCriar}
            text={loading ? "Criando conta..." : "Criar conta"}
            disabled={loading}
          />
        </form>
      </main>
    </div>
  );
}
