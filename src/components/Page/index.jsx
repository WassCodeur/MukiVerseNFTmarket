import { useNavigate } from 'react-router-dom';

export function MonComposant() {
    const navigate = useNavigate();

    const rechargerPage = () => {
        navigate(0); // Équivalent à un rafraîchissement
    };

    return (
        <button onClick={rechargerPage}>Recharger la page</button>
    );
}