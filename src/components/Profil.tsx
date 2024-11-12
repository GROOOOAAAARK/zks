import { useAccount, useEnsName } from "wagmi";

export default function Profile() {
    const address = useAccount();

    const { data, error, status } = useEnsName(address);

    if (status === 'pending') {
        return <div>Loading ENS name...</div>;
    }

    if (status === 'error') {
        return <div>Error loading ENS name: {error.message
            ? error.message
            : 'An error occurred'}</div>;
    }
    return (
        <div>ENS name: {data}</div>
    )

}