import './styles/navbar.css';


export default function Navbar(props) {
    return (
        <>
            <nav class="navbar bg-body-tertiary right-align center-all">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1 heading">{props.course}</span>
                    <button type="button" class="btn btn-outline-secondary getHelpBtn" >Get Help</button>
                    <div class="dropdown mr-05">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src='https://cdn.eckovation.com/images/Profile-01.svg' width={"40px"}></img>
                            Abhinav Rawat
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark">
                            <li><a class="dropdown-item active" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" href="#">Separated link</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            

            
        </>
    );
}