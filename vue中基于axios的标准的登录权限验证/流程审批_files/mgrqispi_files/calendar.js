var weekend = [0,6];
var weekendColor = "#F1F5F4";
var fontface = "Arial";
var fontsize = 2;
var p_refday;
var DeductOneday = 1;

var gNow = new Date();
var ggWinCal;
isNav = (navigator.appName.indexOf("Netscape") != -1) ? true : false;
isIE = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;

Calendar.Months = ["一月", "二月", "三月", "四月", "五月", "六月",
"七月", "八月", "九月", "十月", "十一月", "十二月"];

// Non-Leap year Month days..
Calendar.DOMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Leap year Month days..
Calendar.lDOMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Calendar(p_item, p_WinCal, p_refday, p_month, p_year, p_format) {
	if ((p_month == null) && (p_year == null))	return;

	

	if (p_WinCal == null)
		this.gWinCal = ggWinCal;
	else
		this.gWinCal = p_WinCal;

	if (p_month == null) {
		this.gMonthName = null;
		this.gMonth = null;
		this.gYearly = true;
	} else {
		this.gMonthName = Calendar.get_month(p_month);
		this.gMonth = new Number(p_month);
		this.gDay = p_refday;
		this.gYearly = false;
	}

	this.gYear = p_year;
	this.gFormat = p_format;
	this.gBGColor = "red";
	this.gFGColor = "#003399";
	this.gTextColor = "Blue";
	this.gHeaderColor = "Blue";
	this.gReturnItem = p_item;
}

Calendar.get_month = Calendar_get_month;
Calendar.get_daysofmonth = Calendar_get_daysofmonth;
Calendar.calc_month_year = Calendar_calc_month_year;
Calendar.calc_month_year_cur = Calendar_calc_month_year_cur;
Calendar.print = Calendar_print;


function Calendar_get_month(monthNo) {
	return Calendar.Months[monthNo];
}

function Calendar_get_daysofmonth(monthNo, p_year) {
	/* 
	Check for leap year ..
	1.Years evenly divisible by four are normally leap years, except for... 
	2.Years also evenly divisible by 100 are not leap years, except for... 
	3.Years also evenly divisible by 400 are leap years. 
	*/
	if ((p_year % 4) == 0) {
		if ((p_year % 100) == 0 && (p_year % 400) != 0)
			return Calendar.DOMonth[monthNo];
	
		return Calendar.lDOMonth[monthNo];
	} else
		return Calendar.DOMonth[monthNo];
}

function Calendar_calc_month_year(p_Month, p_Year, incr) {
	/* 
	Will return an 1-D array with 1st element being the calculated month 
	and second being the calculated year 
	after applying the month increment/decrement as specified by 'incr' parameter.
	'incr' will normally have 1/-1 to navigate thru the months.
	*/
	var ret_arr = new Array();
	
	if (incr == -1) {
		// B A C K W A R D
		if (p_Month == 0) {
			ret_arr[0] = 11;
			ret_arr[1] = parseInt(p_Year) - 1;
		}
		else {
			ret_arr[0] = parseInt(p_Month) - 1;
			ret_arr[1] = parseInt(p_Year);
		}
	} else if (incr == 1) {
		// F O R W A R D
		if (p_Month == 11) {
			ret_arr[0] = 0;
			ret_arr[1] = parseInt(p_Year) + 1;
		}
		else {
			ret_arr[0] = parseInt(p_Month) + 1;
			ret_arr[1] = parseInt(p_Year);
		}
	}
	
	return ret_arr;
}

function Calendar_print() {
	ggWinCal.print();
}

function Calendar_calc_month_year_cur(p_Month, p_Year, incr) {
	/* 
	Will return an 1-D array with 1st element being the calculated month 
	and second being the calculated year 
	after applying the month increment/decrement as specified by 'incr' parameter.
	'incr' will normally have 1/-1 to navigate thru the months.
	*/
	var ret_arr = new Array();
	

			ret_arr[0] = parseInt(p_Month) ;
			ret_arr[1] = parseInt(p_Year);
	
	return ret_arr;
}

// This is for compatibility with Navigator 3, we have to create and discard one object before the prototype object exists.
new Calendar();

Calendar.prototype.getMonthlyCalendarCode = function() {
	var vCode = "";
	var vHeader_Code = "";
	var vData_Code = "";
	
	// Begin Table Drawing code here..
	vCode = vCode + "<TABLE BORDER=1 CELLPADDING=5 BGCOLOR=\"" + this.gBGColor + "\" STYLE='border-collapse: collapse'>";
	
	vHeader_Code = this.cal_header();
	vData_Code = this.cal_data();
	vCode = vCode + vHeader_Code + vData_Code;
	
	vCode = vCode + "</TABLE>";
	
	return vCode;
}

Calendar.prototype.format_data = function(p_day) {
	var vData;
	var vMonth = 1 + this.gMonth;
	vMonth = (vMonth.toString().length < 2) ? "0" + vMonth : vMonth;
	var vMon = Calendar.get_month(this.gMonth).substr(0,3).toUpperCase();
	var vFMon = Calendar.get_month(this.gMonth).toUpperCase();
	var vY4 = new String(this.gYear);
	var vY2 = new String(this.gYear.substr(2,2));
	var vDD = (p_day.toString().length < 2) ? "0" + p_day : p_day;

	switch (this.gFormat) {
		case "MM\/DD\/YYYY" :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
			break;
		case "MM\/DD\/YY" :
			vData = vMonth + "\/" + vDD + "\/" + vY2;
			break;
		case "MM-DD-YYYY" :
			vData = vMonth + "-" + vDD + "-" + vY4;
			break;
		case "MM-DD-YY" :
			vData = vMonth + "-" + vDD + "-" + vY2;
			break;

		case "DD\/MON\/YYYY" :
			vData = vDD + "\/" + vMon + "\/" + vY4;
			break;
		case "DD\/MON\/YY" :
			vData = vDD + "\/" + vMon + "\/" + vY2;
			break;
		case "DD-MON-YYYY" :
			vData = vDD + "-" + vMon + "-" + vY4;
			break;
		case "DD-MON-YY" :
			vData = vDD + "-" + vMon + "-" + vY2;
			break;

		case "DD\/MONTH\/YYYY" :
			vData = vDD + "\/" + vFMon + "\/" + vY4;
			break;
		case "DD\/MONTH\/YY" :
			vData = vDD + "\/" + vFMon + "\/" + vY2;
			break;
		case "DD-MONTH-YYYY" :
			vData = vDD + "-" + vFMon + "-" + vY4;
			break;
		case "DD-MONTH-YY" :
			vData = vDD + "-" + vFMon + "-" + vY2;
			break;

		case "DD\/MM\/YYYY" :
			vData = vDD + "\/" + vMonth + "\/" + vY4;
			break;
		case "DD\/MM\/YY" :
			vData = vDD + "\/" + vMonth + "\/" + vY2;
			break;
		case "DD-MM-YYYY" :
			vData = vDD + "-" + vMonth + "-" + vY4;
			break;
		case "DD-MM-YY" :
			vData = vDD + "-" + vMonth + "-" + vY2;
			break;

		case "YYYY\/MM\/DD" :
			vData = vY4 +  "\/" + vMonth + "\/" + vDD;
			break;
		case "YY\/MM\/DD" :
			vData = vY2 +  "\/" + vMonth + "\/" + vDD;
			break;
		case "YYYY-MM-DD" :
			vData = vY4 +  "-" + vMonth + "-" + vDD;
			break;
		case "YY-MM-DD" :
			vData = vY2 +  "-" + vMonth + "-" + vDD;
			break;

		default :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
	}

	return vData;
}

function Get_Date(p_Day, p_Month, p_Year, incr)
{
var vData = "";
var vYear = p_Year;
var vMonth = 1+ p_Month + incr;
var vDay = p_Day - DeductOneday;

vYear = (vMonth>12)? vYear + 1 : vYear;
vYear = (vMonth<1)? vYear - 1 : vYear;

vMonth = (vMonth>12)? vMonth - 12 : vMonth;
vMonth = (vMonth<1)? vMonth + 12 : vMonth;


if(vDay < 1)
{
	if(vMonth - 1 < 1 )
	{ vYear = vYear - 1;
	  vMonth = 12;
	  vDay = 31;
	}
	else
	{ vDay=Calendar_get_daysofmonth(vMonth-2,vYear) ;
	   vMonth = vMonth - 1;}
}
else
{
	if(vDay > Calendar_get_daysofmonth(vMonth-1,vYear))
	{ 
	  vDay = Calendar_get_daysofmonth(vMonth-1,vYear);
	}
	
	
}

Calendar_get_daysofmonth

vMM = (vMonth.toString().length < 2) ? "0" + vMonth : vMonth;
vDD = (vDay.toString().length < 2) ? "0" + vDay : vDay;

	switch (p_format) {
		case "MM\/DD\/YYYY" :
			vData = vMM + "\/" + vDD + "\/" + vYear;
			break;
		case "MM-DD-YYYY" :
			vData = vMM + "-" + vDD + "-" + vYear;
			break;
		case "DD\/MM\/YYYY" :
			vData = vDD + "\/" + vMM + "\/" + vYear;
			break;
		case "DD-MM-YYYY" :
			vData = vDD + "-" + vMM + "-" + vYear;
			break;
		case "YYYY\/MM\/DD" :
			vData = vYear + "\/" + vMM + "\/" + vDD;
			break;
		case "YYYY-MM-DD" :
			vData = vYear + "-" + vMM + "-" + vDD;
			break;

		default :
			vData = vMM + "\/" + vDD + "\/" + vYear;
	}
//alert(vData)
if(incr==0)
	{
	vData="";
}
return vData;
}


Calendar.prototype.show = function() {
	var vCode = "";
	
	this.gWinCal.document.open();

	// Setup the page...
	this.wwrite("<html>");
	this.wwrite("<head><title>日历</title>");
	this.wwrite("</head>");

	this.wwrite("<script language=\"javascript\">"+
		    "function done(sDate,sDay,sMonth,sYear){"+
		    "self.opener.document." + this.gReturnItem + ".value="+
		    "sDate;" + 
		    "if(self.opener.document."+p_item_2+"!=null){"+
		    "self.opener.document."+ p_item_2+".value= window.opener.Get_Date(parseInt(sDay),parseInt(sMonth),parseInt(sYear)," + parseInt(add_month) + ")}"+		    
		    ";window.close()}"+
		    "function init()"+
		    "{"+
		    "from_date=self.opener.document."+p_item+".value;");

	if(p_first=="Y")
	
		this.wwrite("if(from_date !=\"\" && from_date != null && from_date.substring(6,10)>1900"+
			    " && from_date.substring(3,5)<=13 && from_date.substring(3,5)>=1 && "+
			    "from_date.substring(0,2)<=31 && from_date.substring(0,2)>=1){window.opener.Build_Exist(" + 
		"'" + p_item + "', from_date.substring(0,2),from_date.substring(3,5)-1, from_date.substring(6,10), 'DD/MM/YYYY');"+
		"document.calendar.iYear.selectedIndex=from_date.substring(6,10)-1930;"+
		"document.calendar.iMonth.selectedIndex=from_date.substring(3,5)-1;}"+
		    	   "else {document.calendar.iYear.selectedIndex="+(parseInt(this.gYear)-1930)+";"+
		    	   "document.calendar.iMonth.selectedIndex="+(parseInt(this.gMonth))+";}"+
		"}</script>");
		    
	else
		this.wwrite("document.calendar.iYear.selectedIndex="+(parseInt(this.gYear)-1930)+";"+
			    "document.calendar.iMonth.selectedIndex="+(parseInt(this.gMonth))+";}"+
			    "</script>");	    

	this.wwrite("<body bgcolor='#FFFFFF'" + 
	    "link=\"" + this.gLinkColor + "\" " + 
		"vlink=\"" + this.gLinkColor + "\" " +
		"alink=\"" + this.gLinkColor + "\" " +
		"text=\"" + this.gTextColor + "\"  onload=init()  >");
	this.wwriteA("<FONT FACE='" + fontface + "' color=" + "'#003399" + "' SIZE=2><B>");
	//this.wwriteA(this.gMonthName + " " + this.gYear);
	this.wwriteA("</B>");

	// Show navigation buttons
	var prevMMYYYY = Calendar.calc_month_year_cur(this.gMonth, this.gYear, -1);
	var prevMM = prevMMYYYY[0];
	var prevYYYY = prevMMYYYY[1];

	var nextMMYYYY = Calendar.calc_month_year_cur(this.gMonth, this.gYear, 1);
	var nextMM = nextMMYYYY[0];
	var nextYYYY = nextMMYYYY[1];
	
	this.wwrite("<form name=\"calendar\">");
	
	this.wwrite("<TABLE WIDTH='200' BORDER=0 CELLSPACING=0 CELLPADDING=0 BGCOLOR='#FFFFFF'><TR><TD ALIGN=left>");
	
	
	this.wwrite("<select name=\"iYear\" style='WIDTH: 60px' onchange=\"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', '" + this.gMonth + "', this.value, '" + this.gFormat + "'" +
		");\">"+
		"<option value=\"1930\">1930</option>"+ 
		"<option value=\"1931\">1931</option>"+ 
		"<option value=\"1932\">1932</option>"+ 
		"<option value=\"1933\">1933</option>"+ 
		"<option value=\"1934\">1934</option>"+ 
		"<option value=\"1935\">1935</option>"+ 
		"<option value=\"1936\">1936</option>"+ 
		"<option value=\"1937\">1937</option>"+ 
		"<option value=\"1938\">1938</option>"+ 
		"<option value=\"1939\">1939</option>"+ 
		"<option value=\"1940\">1940</option>"+ 
		"<option value=\"1941\">1941</option>"+ 
		"<option value=\"1942\">1942</option>"+ 
		"<option value=\"1943\">1943</option>"+ 
		"<option value=\"1944\">1944</option>"+ 
		"<option value=\"1945\">1945</option>"+ 
		"<option value=\"1946\">1946</option>"+ 
		"<option value=\"1947\">1947</option>"+ 
		"<option value=\"1948\">1948</option>"+ 
		"<option value=\"1949\">1949</option>"+ 
		"<option value=\"1950\">1950</option>"+ 
		"<option value=\"1951\">1951</option>"+ 
		"<option value=\"1952\">1952</option>"+ 
		"<option value=\"1953\">1953</option>"+ 
		"<option value=\"1954\">1954</option>"+ 
		"<option value=\"1955\">1955</option>"+ 
		"<option value=\"1956\">1956</option>"+ 
		"<option value=\"1957\">1957</option>"+ 
		"<option value=\"1958\">1958</option>"+ 
		"<option value=\"1959\">1959</option>"+ 
		"<option value=\"1960\">1960</option>"+ 
		"<option value=\"1961\">1961</option>"+ 
		"<option value=\"1962\">1962</option>"+ 
		"<option value=\"1963\">1963</option>"+ 
		"<option value=\"1964\">1964</option>"+ 
		"<option value=\"1965\">1965</option>"+ 
		"<option value=\"1966\">1966</option>"+ 
		"<option value=\"1967\">1967</option>"+ 
		"<option value=\"1968\">1968</option>"+ 
		"<option value=\"1969\">1969</option>"+ 
		"<option value=\"1970\">1970</option>"+ 
		"<option value=\"1971\">1971</option>"+ 
		"<option value=\"1972\">1972</option>"+ 
		"<option value=\"1973\">1973</option>"+ 
		"<option value=\"1974\">1974</option>"+ 
		"<option value=\"1975\">1975</option>"+ 
		"<option value=\"1976\">1976</option>"+ 
		"<option value=\"1977\">1977</option>"+ 
		"<option value=\"1978\">1978</option>"+ 
		"<option value=\"1979\">1979</option>"+ 
		"<option value=\"1980\">1980</option>"+ 
		"<option value=\"1981\">1981</option>"+ 
		"<option value=\"1982\">1982</option>"+ 
		"<option value=\"1983\">1983</option>"+ 
		"<option value=\"1984\">1984</option>"+ 
		"<option value=\"1985\">1985</option>"+ 
		"<option value=\"1986\">1986</option>"+ 
		"<option value=\"1987\">1987</option>"+ 
		"<option value=\"1988\">1988</option>"+ 
		"<option value=\"1989\">1989</option>"+ 
		"<option value=\"1990\">1990</option>"+ 
		"<option value=\"1991\">1991</option>"+ 
		"<option value=\"1992\">1992</option>"+ 
		"<option value=\"1993\">1993</option>"+ 
		"<option value=\"1994\">1994</option>"+ 
		"<option value=\"1995\">1995</option>"+ 
		"<option value=\"1996\">1996</option>"+ 
		"<option value=\"1997\">1997</option>"+ 
		"<option value=\"1998\">1998</option>"+ 
		"<option value=\"1999\">1999</option>"+ 
		"<option value=\"2000\">2000</option>"+ 
		"<option value=\"2001\">2001</option>"+ 
		"<option value=\"2002\">2002</option>"+ 
		"<option value=\"2003\">2003</option>"+ 
		"<option value=\"2004\">2004</option>"+ 
		"<option value=\"2005\">2005</option>"+ 
		"<option value=\"2006\">2006</option>"+ 
		"<option value=\"2007\">2007</option>"+ 
		"<option value=\"2008\">2008</option>"+ 
		"<option value=\"2009\">2009</option>"+ 
		"<option value=\"2010\">2010</option>"+ 
		"<option value=\"2011\">2011</option>"+ 
		"<option value=\"2012\">2012</option>"+ 
		"<option value=\"2013\">2013</option>"+ 
		"<option value=\"2014\">2014</option>"+ 
		"<option value=\"2015\">2015</option>"+ 
		"<option value=\"2016\">2016</option>"+ 
		"<option value=\"2017\">2017</option>"+ 
		"<option value=\"2018\">2018</option>"+ 
		"<option value=\"2019\">2019</option>"+ 
		"<option value=\"2020\">2020</option>"+ 
		"<option value=\"2021\">2021</option>"+ 
		"<option value=\"2022\">2022</option>"+ 
		"<option value=\"2023\">2023</option>"+ 
		"<option value=\"2024\">2024</option>"+ 
		"<option value=\"2025\">2025</option>"+ 
		"<option value=\"2026\">2026</option>"+ 
		"<option value=\"2027\">2027</option>"+ 
		"<option value=\"2028\">2028</option>"+ 
		"<option value=\"2029\">2029</option>"+ 
		"<option value=\"2030\">2030</option>"+ 
		"<option value=\"2031\">2031</option>"+ 
		"<option value=\"2032\">2032</option>"+ 
		"<option value=\"2033\">2033</option>"+ 
		"<option value=\"2034\">2034</option>"+ 
		"<option value=\"2035\">2035</option>"+ 
		"<option value=\"2036\">2036</option>"+ 
		"<option value=\"2037\">2037</option>"+ 
		"<option value=\"2038\">2038</option>"+ 
		"<option value=\"2039\">2039</option>"+ 
		"<option value=\"2040\">2040</option>"+ 
		"<option value=\"2041\">2041</option>"+ 
		"<option value=\"2042\">2042</option>"+ 
		"<option value=\"2043\">2043</option>"+ 
		"<option value=\"2044\">2044</option>"+ 
		"<option value=\"2045\">2045</option>"+ 
		"<option value=\"2046\">2046</option>"+ 
		"<option value=\"2047\">2047</option>"+ 
		"<option value=\"2048\">2048</option>"+ 
		"<option value=\"2049\">2049</option>"+ 
		"<option value=\"2050\">2050</option>"+ 
		"</select>"+
		"</TD><TD ALIGN=left>");
		
	/*	
	
	this.wwrite("<A HREF=\"" +
		"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', '" + prevMM + "', '" + prevYYYY + "', '" + this.gFormat + "'" +
		");" +
		"\">" + "<img src='/images/lastmonth.gif' border=0 alt='Last month'>" + "<\/A>"+
		
	*/	
		
	this.wwrite("<select name=\"iMonth\" style='WIDTH: 65px' onchange=\"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', this.value, '" + prevYYYY + "', '" + this.gFormat + "'" +
		")\";>"+
		"<option value='0'>一月</option>"+	
		"<option value='1'>二月</option>"+
		"<option value='2'>三月</option>"+
		"<option value='3'>四月</option>"+
		"<option value='4'>五月</option>"+
		"<option value='5'>六月</option>"+
		"<option value='6'>七月</option>"+
		"<option value='7'>八月</option>"+
		"<option value='8'>九月</option>"+
		"<option value='9'>十月</option>"+
		"<option value='10'>十一月</option>"+
		"<option value='11'>十二月</option>"+		
		"</select></TD><TD ALIGN=left></TR>");
	
	this.wwrite("<TR><TD colspan=\"2\">&nbsp</TD></TR></TABLE>");
		
		
		
	//this.wwrite("[<A HREF=\"javascript:window.print();\">Print</A>]</TD><TD ALIGN=center>");
	/*
	this.wwrite("<A HREF=\"" +
		"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', '" + nextMM + "', '" + nextYYYY + "', '" + this.gFormat + "'" +
		");" +
		"\">" + "<img src='/images/nextmonth.gif' border=0 alt='Next month'>" + "<\/A></TD></TR></TABLE>");
	*/
	// Get the complete calendar code for the month..
	vCode = this.getMonthlyCalendarCode();
	this.wwrite(vCode);

	this.wwrite("</font></form></body></html>");
	this.gWinCal.document.close();
}

Calendar.prototype.showY = function() {
	var vCode = "";
	var i;
	var vr, vc, vx, vy;		// Row, Column, X-coord, Y-coord
	var vxf = 285;			// X-Factor
	var vyf = 200;			// Y-Factor
	var vxm = 10;			// X-margin
	var vym;				// Y-margin
	if (isIE)	vym = 75;
	else if (isNav)	vym = 25;
	
	this.gWinCal.document.open();

	this.wwrite("<html>");
	this.wwrite("<head><title>Calendar</title>");
	this.wwrite("<style type='text/css'>\n<!--");
	for (i=0; i<12; i++) {
		vc = i % 3;
		if (i>=0 && i<= 2)	vr = 0;
		if (i>=3 && i<= 5)	vr = 1;
		if (i>=6 && i<= 8)	vr = 2;
		if (i>=9 && i<= 11)	vr = 3;
		
		vx = parseInt(vxf * vc) + vxm;
		vy = parseInt(vyf * vr) + vym;

		this.wwrite(".lclass" + i + " {position:absolute;top:" + vy + ";left:" + vx + ";}");
	}
	this.wwrite("-->\n</style>");
	this.wwrite("</head>");

	this.wwrite("<body " +   
		"link=\"" + this.gLinkColor + "\" " + 
		"vlink=\"" + this.gLinkColor + "\" " +
		"alink=\"" + this.gLinkColor + "\" " +
		"text=\"" + this.gTextColor + "\">");
	this.wwrite("<FONT FACE='" + fontface + "' SIZE=2><B>");
	this.wwrite("Year : " + this.gYear);
	this.wwrite("</B><BR>");

	// Show navigation buttons
	var prevYYYY = parseInt(this.gYear) - 1;
	var nextYYYY = parseInt(this.gYear) + 1;
	
	this.wwrite("<TABLE WIDTH='100%' BORDER=0 CELLSPACING=0 CELLPADDING=0 BGCOLOR='#003399'><TR><TD ALIGN=center>");
	this.wwrite("[<A HREF=\"" +
		"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', null, '" + prevYYYY + "', '" + this.gFormat + "'" +
		");" +
		"\" alt='Prev Year'><<<\/A>]</TD><TD ALIGN=center>");
	this.wwrite("[<A HREF=\"javascript:window.print();\">Print</A>]</TD><TD ALIGN=center>");
	this.wwrite("[<A HREF=\"" +
		"javascript:window.opener.Build(" + 
		"'" + this.gReturnItem + "', null, '" + nextYYYY + "', '" + this.gFormat + "'" +
		");" +
		"\">>><\/A>]</TD></TR></TABLE><BR>");

	// Get the complete calendar code for each month..
	var j;
	for (i=11; i>=0; i--) {
		if (isIE)
			this.wwrite("<DIV ID=\"layer" + i + "\" CLASS=\"lclass" + i + "\">");
		else if (isNav)
			this.wwrite("<LAYER ID=\"layer" + i + "\" CLASS=\"lclass" + i + "\">");

		this.gMonth = i;
		this.gMonthName = Calendar.get_month(this.gMonth);
		vCode = this.getMonthlyCalendarCode();
		this.wwrite(this.gMonthName + "/" + this.gYear + "<BR>");
		this.wwrite(vCode);

		if (isIE)
			this.wwrite("</DIV>");
		else if (isNav)
			this.wwrite("</LAYER>");
	}

	this.wwrite("</font><BR></body></html>");
	this.gWinCal.document.close();
}

Calendar.prototype.wwrite = function(wtext) {
	this.gWinCal.document.writeln(wtext);
}

Calendar.prototype.wwriteA = function(wtext) {
	this.gWinCal.document.write(wtext);
}

Calendar.prototype.cal_header = function() {
	var vCode = "";
	
	vCode = vCode + "<TR>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>日&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>一&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>二&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>三&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>四&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>五&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "<TD WIDTH=''><FONT SIZE='2' FACE='" + fontface + "' COLOR='#003399'>六&nbsp;&nbsp;</b></FONT></TD>";
	vCode = vCode + "</TR>";
	
	return vCode;
}

Calendar.prototype.cal_data = function() {
	var vDate = new Date();
	vDate.setDate(1);
	vDate.setMonth(this.gMonth);
	vDate.setFullYear(this.gYear);

	var vFirstDay=vDate.getDay();
	var vDay=1;
	var vLastDay=Calendar.get_daysofmonth(this.gMonth, this.gYear);
	var vOnLastDay=0;
	var vCode = "";

	/*
	Get day for the 1st of the requested month/year..
	Place as many blank cells before the 1st day of the month as necessary. 
	*/

	vCode = vCode + "<TR>";
	for (i=0; i<vFirstDay; i++) {
		vCode = vCode + "<TD WIDTH=''" + this.write_weekend_string(i) + "><FONT SIZE='2' FACE='" + fontface + "'>&nbsp;</FONT></TD>";
	}

	// Write rest of the 1st week
	for (j=vFirstDay; j<7; j++) {
		vCode = vCode + "<TD WIDTH=''" + this.write_weekend_string(j) + "><FONT SIZE='2' FACE='" + fontface + "'>" + 
			"<A HREF='#' " + 
				"onClick=\"javascript:done('" + this.format_data(vDay) + "','" + 
				vDay + "'," +
				"document.calendar.iMonth.value," +
				"document.calendar.iYear.value);\">" + 
				this.format_day(vDay) + 
			"</A>" + 
			"</FONT></TD>";
		vDay=vDay + 1;
	}
	vCode = vCode + "</TR>";

	// Write the rest of the weeks
	for (k=2; k<7; k++) {
		vCode = vCode + "<TR>";

		for (j=0; j<7; j++) {
			vCode = vCode + "<TD WIDTH=''" + this.write_weekend_string(j) + "><FONT SIZE='2' FACE='" + fontface + "'>" + 
				"<A HREF='#' " + 
				"onClick=\"javascript:done('" + this.format_data(vDay) + "','" + 
				vDay + "'," +
				"document.calendar.iMonth.value," +
				"document.calendar.iYear.value);\">" + 
				this.format_day(vDay) + 
				"</A>" + 
				"</FONT></TD>";
			vDay=vDay + 1;

			if (vDay > vLastDay) {
				vOnLastDay = 1;
				break;
			}
		}

		if (j == 6)
			vCode = vCode + "</TR>";
		if (vOnLastDay == 1)
			break;
	}
	
	// Fill up the rest of last week with proper blanks, so that we get proper square blocks
	for (m=1; m<(7-j); m++) {
		if (this.gYearly)
			vCode = vCode + "<TD WIDTH=''" + this.write_weekend_string(j+m) + 
			"><FONT SIZE='2' FACE='" + fontface + "' COLOR='green'>&nbsp;</FONT></TD>";
		else
			vCode = vCode + "<TD WIDTH=''" + this.write_weekend_string(j+m) + 
			"><FONT SIZE='2' FACE='" + fontface + "' COLOR='green'>" + m + "</FONT></TD>";
	}
	
	return vCode;
}

Calendar.prototype.format_day = function(vday) {
	var vNowDay = gNow.getDate();
	var vNowMonth = gNow.getMonth();
	var vNowYear = gNow.getFullYear();

	//if (vday == vNowDay && this.gMonth == vNowMonth && this.gYear == vNowYear)
	if (vday == this.gDay )
		return ("<FONT COLOR=\"RED\" ><B>" + vday + "</B></FONT>");
	else
		return (vday);
}


Calendar.prototype.write_weekend_string = function(vday) {
	var i;

	// Return special formatting for the weekend day.
	for (i=0; i<weekend.length; i++) {
		if (vday == weekend[i])
			return (" BGCOLOR=\"" + weekendColor + "\"");
	}
	
	return "";
}

Calendar.prototype.format_data = function(p_day) {
	var vData;
	var vMonth = 1 + this.gMonth;
	vMonth = (vMonth.toString().length < 2) ? "0" + vMonth : vMonth;
	var vMon = Calendar.get_month(this.gMonth).substr(0,3).toUpperCase();
	var vFMon = Calendar.get_month(this.gMonth).toUpperCase();
	var vY4 = new String(this.gYear);
	var vY2 = new String(this.gYear.substr(2,2));
	var vDD = (p_day.toString().length < 2) ? "0" + p_day : p_day;

	switch (this.gFormat) {
		case "MM\/DD\/YYYY" :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
			break;
		case "MM\/DD\/YY" :
			vData = vMonth + "\/" + vDD + "\/" + vY2;
			break;
		case "MM-DD-YYYY" :
			vData = vMonth + "-" + vDD + "-" + vY4;
			break;
		case "MM-DD-YY" :
			vData = vMonth + "-" + vDD + "-" + vY2;
			break;

		case "DD\/MON\/YYYY" :
			vData = vDD + "\/" + vMon + "\/" + vY4;
			break;
		case "DD\/MON\/YY" :
			vData = vDD + "\/" + vMon + "\/" + vY2;
			break;
		case "DD-MON-YYYY" :
			vData = vDD + "-" + vMon + "-" + vY4;
			break;
		case "DD-MON-YY" :
			vData = vDD + "-" + vMon + "-" + vY2;
			break;

		case "DD\/MONTH\/YYYY" :
			vData = vDD + "\/" + vFMon + "\/" + vY4;
			break;
		case "DD\/MONTH\/YY" :
			vData = vDD + "\/" + vFMon + "\/" + vY2;
			break;
		case "DD-MONTH-YYYY" :
			vData = vDD + "-" + vFMon + "-" + vY4;
			break;
		case "DD-MONTH-YY" :
			vData = vDD + "-" + vFMon + "-" + vY2;
			break;

		case "DD\/MM\/YYYY" :
			vData = vDD + "\/" + vMonth + "\/" + vY4;
			break;
		case "DD\/MM\/YY" :
			vData = vDD + "\/" + vMonth + "\/" + vY2;
			break;
		case "DD-MM-YYYY" :
			vData = vDD + "-" + vMonth + "-" + vY4;
			break;
		case "DD-MM-YY" :
			vData = vDD + "-" + vMonth + "-" + vY2;
			break;

		case "YYYY\/MM\/DD" :
			vData = vY4 +  "\/" + vMonth + "\/" + vDD;
			break;
		case "YY\/MM\/DD" :
			vData = vY2 +  "\/" + vMonth + "\/" + vDD;
			break;
		case "YYYY-MM-DD" :
			vData = vY4 +  "-" + vMonth + "-" + vDD;
			break;
		case "YY-MM-DD" :
			vData = vY2 +  "-" + vMonth + "-" + vDD;
			break;

		default :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
	}

	return vData;
}




function Build_Exist(p_item, p_refday, p_month, p_year, p_format) {
	var p_WinCal = ggWinCal;
	
	gCal = new Calendar(p_item, p_WinCal, p_refday, p_month, p_year, p_format);
	p_first="N";

	// Customize your Calendar here..
	gCal.gBGColor="white";
	gCal.gLinkColor="black";
	gCal.gTextColor="black";
	gCal.gHeaderColor="darkgreen";

	// Choose appropriate show function
	if (gCal.gYearly)	gCal.showY();
	else	gCal.show();
}

function Build(p_item, p_month, p_year, p_format) {
	var p_WinCal = ggWinCal;
	


	
	gCal = new Calendar(p_item, p_WinCal, p_refday, p_month, p_year, p_format);
	p_first="N";

	// Customize your Calendar here..
	gCal.gBGColor="white";
	gCal.gLinkColor="black";
	gCal.gTextColor="black";
	gCal.gHeaderColor="darkgreen";

	// Choose appropriate show function
	if (gCal.gYearly)	gCal.showY();
	else	gCal.show();
}
function Build_First(p_item, p_month, p_year, p_format) {
	var p_WinCal = ggWinCal;
	var p_refday = gNow.getDate();

	gCal = new Calendar(p_item, p_WinCal, p_refday, p_month, p_year, p_format);
	
	// Customize your Calendar here..
	gCal.gBGColor="white";
	gCal.gLinkColor="black";
	gCal.gTextColor="black";
	gCal.gHeaderColor="darkgreen";

	// Choose appropriate show function
	if (gCal.gYearly)	gCal.showY();
	else	gCal.show();
}
function show_calendar() {
	/* 
		p_month : 0-11 for Jan-Dec; 12 for All Months.
		p_year	: 4-digit year
		p_format: Date format (mm/dd/yyyy, dd/mm/yy, ...)
		p_item	: Return Item.
	*/

	p_item = arguments[0];
	p_item_2 = arguments[1];	
	add_month = arguments[2];
	if (arguments[3] == null)
		{
		p_month = new String(gNow.getMonth());
		p_first="Y";
		}
	else
		{p_month = arguments[3];
		 P_first="N";}
		
		
	if (arguments[4] == "" || arguments[4] == null)
		p_year = new String(gNow.getFullYear().toString());
	else
		p_year = arguments[4];
		
	if (arguments[5] == null)
		p_format = "DD/MM/YYYY";
	else
		p_format = arguments[5];
		

	
	vWinCal = window.open("", "", 
		"width=250,height=250,status=no,menubar=no,resizable=no,top=200,left=200");
	vWinCal.opener = self;
	ggWinCal = vWinCal;

	Build_First(p_item, p_month, p_year, p_format);
}
/*
Yearly Calendar Code Starts here
*/
function show_yearly_calendar(p_item, p_year, p_format) {
	// Load the defaults..
	if (p_year == null || p_year == "")
		p_year = new String(gNow.getFullYear().toString());
	if (p_format == null || p_format == "")
		p_format = "MM/DD/YYYY";

	var vWinCal = window.open("", "Calendar", "scrollbars=yes");
	vWinCal.opener = self;
	ggWinCal = vWinCal;

	Build(p_item, null, p_year, p_format);
}


function Find_Staff(arguments,source)  
{ 
	 vWinCal = window.open("mgrqispi.dll?Appname=HRsoft2000&Prgname=SendMessageFindName&ARGUMENTS=-A"+WEBID+",-A"+arguments+",-A"+source+",-AC", "",  
		"width=700,height=450,status=no,resizable=yes,scrollbars=yes,top=20,left=20"); 
	 vWinCal.opener = self;
	 ggWinCal = vWinCal;
} 
function Find_Criterior(arguments,table_name,field_name,language)  
{ 
	 vWinCal = window.open("mgrqispi.dll?Appname=HRsoft2000&Prgname=PER_FindCriterior&ARGUMENTS=-A"+arguments+",-A"+table_name+",-A"+field_name+",-A"+language, "",  
		"width=450,height=250,status=no,resizable=yes,scrollbars=yes,top=80,left=100"); 
	 vWinCal.opener = self;
	 ggWinCal = vWinCal;
} 
function Define_Range(web_id,table_name,field_code,field_name,language,field_name_perempms)  
{ 
	 vWinCal = window.open("mgrqispi.dll?Appname=HRsoft2000&Prgname=Sys_Define_Range_Sub&ARGUMENTS=-A"+web_id+",-A"+table_name+",-A"+field_code+",-A"+field_name+",-A"+language+",-A"+field_name_perempms, "",  
		"width=550,height=450,status=no,resizable=yes,scrollbars=yes,top=80,left=100"); 
	 vWinCal.opener = self;
	 ggWinCal = vWinCal;
} 
function Find_Staff_Rng(web_id,arguments,source,language,istermination)  
{
	 vWinCal = window.open("mgrqispi.dll?Appname=HRsoft2000&Prgname=SendMessageFindName_Rng&ARGUMENTS=-A"+web_id+",-A"+arguments+",-A"+source+",-A"+language+",-A"+istermination, "",  
		"width=600,height=350,status=no,resizable=yes,scrollbars=yes,top=80,left=100"); 
	 vWinCal.opener = self;
	 ggWinCal = vWinCal;
}

function limitattach(file,opt) 
{
  if(opt==''){extArray = new Array(".gif", ".jpg", ".bmp", ".png", ".tif", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".psv", ".txt", ".htm", ".pdf", ".ppt", ".pptx",".swf",".rar");}
  if(opt=='H'){extArray = new Array(".htm");}
  if(opt=='C'){extArray = new Array(".csv");}
  if(opt=='I'){extArray = new Array(".gif", ".jpg", ".bmp", ".png", ".tif");}
  if (!file) {return true;}
  while (file.indexOf("\\") != -1)
  {
    file = file.slice(file.indexOf("\\") + 1);
    ext = file.slice(file.indexOf(".")).toLowerCase();
	ext = ext.slice(-5);
	ext = ext.slice(ext.indexOf("."));
    allowsumit = false;
    for (var i = 0; i < extArray.length; i++) 
    {
      if (extArray[i] == ext) 
      {
        allowsumit = true;
      }
    }
  }
  if(allowsumit)
  {return true;}else{alert("对不起，附件只支持下列后缀名的文件：" + extArray.join("  ") + "，请重新选择文件！");return false;}
}

function CheckLength(strTemp)
{ 
  var i,sum;
  sum=0;
  for(i=0;i<strTemp.length;i++) 
  { 
    if ((strTemp.charCodeAt(i)>=0) && (strTemp.charCodeAt(i)<=255)) {
      sum=sum+1;
    }else {
      sum=sum+2;
    }
  }
  return sum; 
}