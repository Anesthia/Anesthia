import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Index() {
  const location = useLocation();
  const successMessage = location.state?.message;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {successMessage && (
          <Alert className="mb-8 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 System Kwestionariusza Anestezjologicznego
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kompleksowy system do zbierania informacji przedoperacyjnych i oceny anestezjologicznej
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Kwestionariusz Pacjenta</CardTitle>
              <CardDescription>
                Interaktywny formularz dla pacjentów do wypełnienia przed zabiegiem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/patient">
                <Button className="w-full">
                  Wypełnij Kwestionariusz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Panel Lekarza</CardTitle>
              <CardDescription>
                Interfejs dla lekarzy do przeglądania i edycji kwestionariuszy
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/doctor">
                <Button variant="outline" className="w-full">
                  Panel Lekarza
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            System zaprojektowany dla bezpiecznej i efektywnej opieki przedoperacyjnej
          </p>
        </div>
      </div>
    </div>
  );
}
