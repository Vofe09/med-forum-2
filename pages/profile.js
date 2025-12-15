import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));

        if (!cookie) {
            router.push("/login");
            return;
        }

        try {
            setUser(
                JSON.parse(decodeURIComponent(cookie.split("=")[1]))
            );
        } catch {
            router.push("/login");
        }
    }, []);

    const logout = () => {
        document.cookie = "user=; Max-Age=0; path=/";
        router.push("/login");
    };

    if (!user) return null;

    return (
        <div style={{ padding: 40 }}>
            <h1>Профиль</h1>

            <p><b>ID:</b> {user.id}</p>
            <p><b>Имя:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>

            <button onClick={logout}>Выйти</button>
        </div>
    );
}
