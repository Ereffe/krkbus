import "./App.css";
import { Button } from "./components/ui/button";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
export default App;
