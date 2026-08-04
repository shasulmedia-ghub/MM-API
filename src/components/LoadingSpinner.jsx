function LoadingSpinner({

    message = "Loading...",

    fullscreen = true,

}) {

    const spinner = (

        <div className="text-center">

            <div
                className="spinner-border text-danger"
                style={{
                    width: "4rem",
                    height: "4rem",
                }}
            />

            <h5 className="mt-4 text-secondary">

                {message}

            </h5>

        </div>

    );

    if (!fullscreen) {

        return spinner;

    }

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "#f8f9fa",
            }}
        >

            {spinner}

        </div>

    );

}

export default LoadingSpinner;