export const powerBISrc = "https://app.powerbi.com/reportEmbed?reportId=8192d0bf-6982-4785-abba-7d32b9850c8b&autoAuth=true&ctid=18791e17-6159-4f52-a8d4-de814ca8284a";

const DemoIframePowerBI = () => {
    return (
        <div>
            <iframe
                title="tri_visual"
                width="1500"
                height="300"
                src={powerBISrc}
            />
        </div>
    );
};

export default DemoIframePowerBI;