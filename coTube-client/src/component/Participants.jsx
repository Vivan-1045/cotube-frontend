export default function Participants({ participants ,host}) {

    return (
        <div className="border rounded-lg p-4">

            <h2 className="font-bold mb-3">
                Participants ({participants.length})
            </h2>

            {participants.map((p) => (
                <div
                    key={p.id}
                    className="border-b py-2"
                >
                    {p.userName===host?`${p.userName} (Host)`:p.userName}
                </div>
            ))}

        </div>
    );
}