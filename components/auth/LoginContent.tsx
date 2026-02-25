"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-warm-gray">{tc("loading")}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">
            {t("welcomeTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleSignInButton />
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-warm-gray">{tc("or")}</span>
            <Separator className="flex-1" />
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
              <TabsTrigger value="register">{t("register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-4">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
