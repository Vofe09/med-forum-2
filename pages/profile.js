import Head from "next/head";
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
            setUser(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
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
        <>
            <Head>
                <link rel="stylesheet" href="/css/profile_style.css" />
            </Head>

            <div className="profile-page">
                <header className="profile-header">
                    <span>header</span>
                    <button onClick={logout}>logout</button>
                </header>

                <div className="profile-card">
                    <div className="profile-avatar">avatar</div>

                    <div className="profile-info">
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                    </div>

                    <div className="profile-points">
                        <span>AMOUNT POINTS</span>
                        <strong>0</strong>
                    </div>
                </div>

                <div className="profile-comments">
                    comments (in future)
                </div>
            </div>
        </>
    );
}
