import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserCheck, Lock, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for testing
  const DEMO_CREDENTIALS = [
    { login: "anestezjolog", password: "demo123", name: "Dr Anna Kowalska" },
    { login: "lekarz", password: "haslo", name: "Dr Jan Nowak" },
    { login: "demo", password: "demo", name: "Dr Demo Lekarz" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check demo credentials
      const validCredential = DEMO_CREDENTIALS.find(
        cred => cred.login === formData.login && cred.password === formData.password
      );

      if (validCredential) {
        // Successful login
        login({
          id: validCredential.login,
          name: validCredential.name,
          role: "doctor"
        });
        
        toast.success(`Zalogowano pomyślnie! Witaj ${validCredential.name}`);
        navigate("/doctor");
      } else {
        toast.error("Nieprawidłowe dane logowania");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas logowania");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel Lekarza
          </h1>
          <p className="text-gray-600">
            Anestezjologia - Logowanie
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Zaloguj się</CardTitle>
            <CardDescription className="text-center">
              Wprowadź swoje dane logowania aby uzyskać dostęp do panelu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login" className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Login</span>
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Wprowadź login"
                  value={formData.login}
                  onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Hasło</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Wprowadź hasło"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Dane testowe:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {DEMO_CREDENTIALS.map((cred, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Login: <strong>{cred.login}</strong></span>
                    <span>Hasło: <strong>{cred.password}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do strony głównej
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
