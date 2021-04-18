import { Circle } from 'better-react-spinkit';
function Loading() {
    return (
        <center style={{ display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <img
                    src="https://blazedcorner.com/wp-content/uploads/2020/10/Blazed-Corner.png"
                    alt=""
                    style={{marginBottom: 13 }}
                    height={233}
                />
                <Circle color="#6714A1" size={ 55 } />
            </div>
        </center>
    );
}

export default Loading;
