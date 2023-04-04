import './styles/sideMenu.css';



export default function SideBar() {
    return (
        <>
            <nav class="rvm-v1 rvm-v1-main-nav-cntr flex-column" id="sidebar" sidebar>

                <div class="rvm-v1-sidebar-logo-ctnr center-all">
                    <img ng-src="https://cdn.pegasus.imarticus.org/images/imarticus-new-logo.svg" alt="Imarticus" role="button" width="80%" src="https://cdn.pegasus.imarticus.org/images/imarticus-new-logo.svg" aria-hidden="false"/>
                </div>
                <ul class="rvm-v1-sidebar-item-ctnr">
                <a href="#">
                    <li class="rvm-v1-sidebar-item active center-all" aria-current="page" >
                        <div style={{width:"80%"}}>
                            Course
                        </div>
                    </li>
                </a>
                <a href="#">
                    <li class="rvm-v1-sidebar-item center-all" aria-current="page" >
                        <div style={{width:"80%"}}>
                            Discussion
                        </div>
                    </li>
                </a>

                </ul>
            </nav>
        </>
    );
}