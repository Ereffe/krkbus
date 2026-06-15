import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bus, Mail, Phone, Type, Calendar, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useT } from "@/i18n";

export function Register() {
  const t = useT();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.register(form);
      setSuccessData(response);
    } catch (err: any) {
      setError(err.message || t("app.register.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    if (successData) {
      login(successData.token, successData.role);
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-green-200 dark:border-green-900">
            <div className="flex flex-col items-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                {t("app.register.successTitle")}
              </h2>
            </div>

            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-6">
              <AlertTitle className="text-green-800 dark:text-green-300">{t("app.register.successAlertTitle")}</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400 mt-2">
                <div className="space-y-2 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-green-100 dark:border-green-800">
                  <p><strong>{t("app.register.loginLabel")}:</strong> {successData.login}</p>
                  <p><strong>{t("app.register.passwordLabel")}:</strong> {successData.password}</p>
                  <p><strong>{t("app.register.clientNumberLabel")}:</strong> {successData.clientNumber}</p>
                </div>
                <p className="mt-4 text-sm font-sans">
                  {t("app.register.activationEmailSent")} (<strong>{form.email}</strong>).
                </p>
              </AlertDescription>
            </Alert>

            <Button onClick={handleProceed} className="w-full flex justify-center bg-green-600 hover:bg-green-700">
              {t("app.register.goToAccount")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Bus className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t("app.register.title")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("app.register.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t("app.register.loginLink")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("app.register.firstNameLabel")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Jan"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("app.register.lastNameLabel")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Kowalski"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("app.register.dobLabel")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("app.register.emailLabel")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="jan.kowalski@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("app.register.phoneLabel")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="+48 123 456 789"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? t("app.register.registering") : t("app.register.submitButton")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}