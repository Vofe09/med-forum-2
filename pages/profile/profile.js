import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // читаем cookie "user"
        const cookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));

        if (!cookie) {
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(
                decodeURIComponent(cookie.split("=")[1])
            );

            setUser(parsedUser);
        } catch (err) {
            console.error("Ошибка чтения cookie", err);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        document.cookie = "user=; Max-Age=0; path=/";
        router.push("/login");
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={styles.container}>
            <h1>Профиль</h1>

            <div style={styles.card}>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Имя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <button onClick={logout} style={styles.button}>
                Выйти
            </button>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px"
    },
    card: {
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        minWidth: "280px"
    },
    button: {
        padding: "10px 20px",
        cursor: "pointer"
    }
};
