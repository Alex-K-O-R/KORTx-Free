KORtx = Object.assign((typeof KORtx !== 'undefined')?KORtx:{}, {
    KCookies : {
        Set:function(c_name,value,expirationDays)
        {
            var domainString = window.location.hostname;
            if(domainString==""){
                if(window.location.origin.indexOf('file://')===0) alert('Sorry. Cookies are not available in file:// protocol. Use http(s):// instead.');
                domainString = ""; // or undefined or .app.localhost ?
            } else {
                domainString = " domain="+domainName+";";
            }

            var exdate=new Date();
            exdate.setDate(exdate.getDate() + expirationDays);
            var c_value=encodeURI(value) + ((expirationDays==null) ? "" : "; secure; path=/;"+(domainString)+" expires="+exdate.toUTCString());

            document.cookie=c_name + "=" + c_value;
        }

        ,Get:function(c_name)
        {
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + c_name + "=");
            if (c_start == -1)
            {
                c_start = c_value.indexOf(c_name + "=");
            }
            if (c_start == -1)
            {
                c_value = null;
            }
            else
            {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end == -1)
                {
                    c_end = c_value.length;
                }
                c_value = unescape(c_value.substring(c_start,c_end));
            }
            return c_value;
        }

    }
});