import { AuthProvider } from "./AuthContext";
import Navigation from "./Navigation";
import { SongProvider } from "./SongContext";

export default function App() {
  return (
    <AuthProvider>
      <SongProvider>
        <Navigation />
      </SongProvider>
    </AuthProvider>
  );
}
