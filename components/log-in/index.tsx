import { ButtonPrimary } from "ui/buttons";
import { InputForm } from "ui/inputs";
import { Error, SubTitle, TinyText } from "ui/texts";
import { Root, Container } from "./styled";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authenticate, saveToken, sendCode } from "lib/api";
import { useRouter } from "next/router";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    unregister,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  async function handleEmail(data: any) {
    if (data.email !== "") {
      const codeSended = await sendCode(data.email);
      if (codeSended) {
        setEmail(data.email);
        reset();
      } else {
        window.alert("Error");
      }
    }
  }

  async function handleCode(data: any) {
    const auth = await authenticate(email, data.code);
    if (auth) {
      saveToken(auth.token);
      router.push({ pathname: "/" });
    } else {
      window.alert("Error");
    }
  }

  return (
    <Root>
      <SubTitle>Ingresar</SubTitle>
      {!email ? (
        <form onSubmit={handleSubmit(handleEmail)}>
          <Container>
            <label>
              <InputForm
                type={"email"}
                placeholder="Email"
                color="#8a8a8a"
                {...register("email")}
              ></InputForm>
              {errors.email && <Error>Este campo es obligatorio</Error>}
            </label>
            <ButtonPrimary text="Continuar"></ButtonPrimary>
          </Container>
        </form>
      ) : (
        <form onSubmit={handleSubmit(handleCode)}>
          <Container style={{ minHeight: "80px" }}>
            <label>
              <InputForm
                type={"number"}
                placeholder="Codigo"
                color="#8a8a8a"
                {...register("code")}
              ></InputForm>
              {errors.codigo && <Error>Este campo es obligatorio</Error>}
            </label>
            <TinyText>Te enviamos un codigo a tu email</TinyText>
            <ButtonPrimary text="Ingresar"></ButtonPrimary>
          </Container>
        </form>
      )}
    </Root>
  );
}
