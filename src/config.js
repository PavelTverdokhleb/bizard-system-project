let BASE_URL, SECOND_URL;

if(window.location.host == "localhost:8080") {
    // BASE_URL = 'http://api.dev.bizard-tunnel.com';
    BASE_URL = 'https://api.bizard-tunnel.com';
    SECOND_URL = 'http://api.dev.bizard-tunnel.com';
}else if(window.location.host == "business.bizardsystem.com"){
    BASE_URL = 'https://api.bizard-tunnel.com';
    SECOND_URL = 'http://api.dev.bizard-tunnel.com';
}else if(window.location.host == "business.bizard-tunnel.com"){
    BASE_URL = 'https://api.bizard-tunnel.com';
    SECOND_URL = 'http://api.dev.bizard-tunnel.com';
}else{
    BASE_URL = 'http://api.dev.bizard-tunnel.com';
    SECOND_URL = 'http://api.dev.bizard-tunnel.com';
}

export const API_BASE_URL = BASE_URL;
export const API_SECOND_URL = SECOND_URL;
