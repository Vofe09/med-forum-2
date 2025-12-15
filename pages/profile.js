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

    if (!user) return null;

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/profile_style.css" />
            </Head>

            <div className="container profile-page">
                {/* PROFILE PANEL */}
                <div className="profile-panel">
                    <div className="profile-main">
                        <img
                            className="profile-avatar"
                            src={user.avatar || "/avatar-placeholder.png"}
                            alt="avatar"
                        />

                        <div className="profile-meta">
                            <h1>{user.username}</h1>
                            <span>{user.email}</span>
                        </div>

                        <div className="profile-stats">
                            <div>
                                <strong>0</strong>
                                <span>Points</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FUTURE CONTENT */}
                <div className="profile-panel muted">
                    comments (in future)
                </div>
            </div>
        </>
    );
}
