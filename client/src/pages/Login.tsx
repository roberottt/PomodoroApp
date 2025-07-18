import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Target, Clock, AlertCircle } from "lucide-react";

export const Login = () => {
  const { login, loading, error } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-peach-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl shadow-2xl border-pink-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-coral to-pink text-white text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">StudyBuddy</CardTitle>
            <p className="text-base sm:text-lg opacity-90 mt-2 px-2">Tu Adorable Compañero de Estudio Pomodoro</p>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-coral/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Temporizador Pomodoro</h3>
                    <p className="text-sm text-gray-600">Mantente enfocado con sesiones de estudio personalizables</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Gestión de Tareas</h3>
                    <p className="text-sm text-gray-600">Organiza y rastrea tus objetivos de estudio</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-peach/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-peach" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Seguimiento del Estado de Ánimo</h3>
                    <p className="text-sm text-gray-600">Monitorea tu bienestar y progreso</p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                onClick={login}
                disabled={loading}
                className="w-full bg-gradient-to-r from-coral to-pink text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 mr-3 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Inicia sesión para guardar tu progreso y sincronizar entre dispositivos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
