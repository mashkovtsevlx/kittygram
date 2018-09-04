var depvalue;
var ofvalue;
$.ajax({
    dataType: "json",
    method: 'GET',
    url: 'https://boards-api.greenhouse.io/v1/boards/convene/jobs?content=true',
    success: function (result) {
        $('.container.content').append('<div class="jobs-container"><div class="table-out"><table id="table-main" class="table" style="font-family: \'Graphik Web\',sans-serif; color: #676767"><tbody></tbody></table></div></div>');
        var jobs = result['jobs'];
        var departments = [];
        var offices = [];
        var vac = {};
        for (var i = 0; i < jobs.length; i++) {
            vac[i] = {};
            vac[i]['department'] = jobs[i]['departments'][0]['name'];
            vac[i]['url'] = jobs[i]['absolute_url'];
            vac[i]['title'] = jobs[i]['title'];
            if (jobs[i]['offices'][0]['location'] != null)
            {
                var temparr = jobs[i]['offices'][0]['location'].split(',');
                vac[i]['location'] = temparr[0] + ', ' + temparr[1];
            }
            else
            {
                vac[i]['location'] = "";
            }
            if (jobs[i]['departments'][0]['parent_id'] != null) {
                $.ajax({
                    dataType: "json",
                    method: 'GET',
                    async: false,
                    url: 'https://boards-api.greenhouse.io/v1/boards/convene/departments/' + jobs[i]['departments'][0]['parent_id'],
                    success: function (res) {
                        vac[i]['parent'] = res['name'];   
                        if (departments.indexOf(vac[i]['parent']) <= -1)
                            departments.push(vac[i]['parent']);
                        if (departments.indexOf(vac[i]['parent'] + ' - ' + vac[i]['department']) <= -1)
                            departments.push(vac[i]['parent'] + ' - ' + vac[i]['department']);
                        if (offices.indexOf(vac[i]['location']) <= -1)
                            offices.push(vac[i]['location']);
                    }
                });
            } else {
                vac[i]['parent'] = null;
                if (departments.indexOf(jobs[i]['departments'][0]['name']) <= -1) {
                    departments.push(jobs[i]['departments'][0]['name']);
                }
                if (offices.indexOf(vac[i]['location']) <= -1) {
                    offices.push(vac[i]['location']);
                }
            }
            var tbody = $('.jobs-container table tbody');
            if (vac[i]['parent'] != null)
            {
                parent_elem = $('th[name="parent"][data-val="' + vac[i]['parent'] + '"]').first();
                if(parent_elem.length)
                {
                    department_elem = $('th[name="department"][data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '"]').first();
                    if (department_elem.length)
                        department_elem.parent().after('<tr><th class="noborder" name="parent" data-val="' + vac[i]['parent'] + '"></th><th style="display: none" class="noborder" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '"></th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                    else
                        parent_elem.parent().after('<tr><th class="noborder" name="parent" data-val="' + vac[i]['parent'] + '"></th><th style="display: none" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                }
                else
                    tbody.prepend('<tr><th class="tspace" colspan="4" style="border-top: none; padding-top: 20px"></tr><tr class="jobs-container-ti"><th style="padding-top: 30px;" class="jobs-container-tit" name="parent" data-val="' + vac[i]['parent'] + '">' + vac[i]['parent'] + '</th><th style="padding-top: 30px; display: none" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" style="padding-top: 30px;" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th style="padding-top: 30px;" name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
            }
            else
            {
                department_elem = $('.jobs-container table tbody tr th[name="department"][data-val="' + vac[i]['department'] + '"]').first();
                if (department_elem.length)
                {
                    department_elem.parent().after('<tr><th name="parent" data-val="0" class="noborder"></th><th style="display: none" class="noborder" name="department" data-val="' + vac[i]['department'] + '"></th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                }
                else
                {
                    tbody.append('<tr><th class="tspace" colspan="4" style="border-top: none; padding-top: 20px"></tr><tr class="jobs-container-ti"><th style="padding-top: 30px;" class="jobs-container-tit" name="department" data-val="' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" style="padding-top: 30px;" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th style="padding-top: 30px;" name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                }
            }
        }
        var seltext = '<div class="jobs-pretext" style="width: 100%; font-size: 22px;margin-bottom: 185px;"><span style="width: 900px; display:block; font-family: \'Chronicle Display A\',\'Chronicle Display B\'; color: #1a1a1a">We’re always looking to grow our talented team, and hope we have a position available for you. Please also check out our <a href="#" style="color: #1a1a1a; text-decoration: underline">culture page</a> to learn more about what it’s like working at Convene.</span></div><div class="jobs-select" style="padding: 50px 0;background-color: #ececec;width: 100%;display: block;position: absolute;left: 0;margin-top: -142px;font-size: 30px;font-family: \'Chronicle Display A\',\'Chronicle Display B\';"><div class="container"><span class="job-container-t">View openings in </span><div class="dropdown dropdown-departments"><span class="selected" onclick="drop(\'departments\')" data-val="0"><span class="sel-text">All Departments<sup>' + departments.length + '</sup></span><div class="dropdown-child dropdown-hidden"><span onclick="depart(this)" data-val="0">All Departments<sup>' + departments.length + '</sup></span>';
        for (var i = 0; i < departments.length; i++) {
            seltext = seltext + '<span onclick="depart(this)" data-val="' + departments[i] + '">' + departments[i] + '</span>';
        }
        seltext = seltext + '</div></div><span> in  </span><div class="dropdown dropdown-offices"><span class="selected" onclick="drop(\'offices\')" data-val="0"><span class="sel-text">All Offices<sup>' + offices.length + '</sup></span><div class="dropdown-child dropdown-hidden"><span onclick="offic(this)" data-val="0">All Offices<sup>' + offices.length + '</sup></span>';
        for (var i = 0; i < offices.length; i++) {
            seltext = seltext + '<span onclick="offic(this)" data-val="' + offices[i] + '">' + offices[i] + '</span>';
        }
        seltext = seltext + '</div></div></div></div>'
        $('.jobs-container').prepend(seltext);
    },
    error: function () {
        alert('no');
    }
});

function depchange() {
    var depvalue = $.trim($('.dropdown-departments .selected').attr('data-val'));
    var ofvalue = $.trim($('.dropdown-offices .selected').attr('data-val'));
    var index_1;
    $('.table-out').remove();
    $.ajax({
        dataType: "json",
        method: 'GET',
        url: 'https://boards-api.greenhouse.io/v1/boards/convene/jobs?content=true',
        success: function (result) {
            $('.jobs-container').append('<div class="table-out"><table id="table-main" class="table" style="font-family: \'Graphik Web\',sans-serif; color: #676767"><tbody></tbody></table></div>');
            var jobs = result['jobs'];
            var departments = [];
            var offices = [];
            var vac = {};
            for (var i = 0; i < jobs.length; i++) {
                vac[i] = {};
                vac[i]['department'] = jobs[i]['departments'][0]['name'];
                vac[i]['url'] = jobs[i]['absolute_url'];
                vac[i]['title'] = jobs[i]['title'];
                if (jobs[i]['offices'][0]['location'] != null)
                {
                    var temparr = jobs[i]['offices'][0]['location'].split(',');
                    vac[i]['location'] = temparr[0] + ', ' + temparr[1];
                }
                else
                {
                    vac[i]['location'] = "";
                }
                if (jobs[i]['departments'][0]['parent_id'] != null) {
                    $.ajax({
                        dataType: "json",
                        method: 'GET',
                        async: false,
                        url: 'https://boards-api.greenhouse.io/v1/boards/convene/departments/' + jobs[i]['departments'][0]['parent_id'],
                        success: function (res) {
                            vac[i]['parent'] = res['name'];   
                            if (departments.indexOf(vac[i]['parent']) <= -1)
                                departments.push(vac[i]['parent']);
                            if (departments.indexOf(vac[i]['parent'] + ' - ' + vac[i]['department']) <= -1)
                                departments.push(vac[i]['parent'] + ' - ' + vac[i]['department']);
                            if (offices.indexOf(vac[i]['location']) <= -1)
                                offices.push(vac[i]['location']);
                        }
                    });
                } else {
                    vac[i]['parent'] = null;
                    if (departments.indexOf(jobs[i]['departments'][0]['name']) <= -1) {
                        departments.push(jobs[i]['departments'][0]['name']);
                    }
                    if (offices.indexOf(vac[i]['location']) <= -1) {
                        offices.push(vac[i]['location']);
                    }
                }
                var tbody = $('.jobs-container table tbody');
                if (vac[i]['parent'] != null)
                {
                    parent_elem = $('th[name="parent"][data-val="' + vac[i]['parent'] + '"]').first();
                    if(parent_elem.length)
                    {
                        department_elem = $('th[name="department"][data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '"]').first();
                        if (department_elem.length)
                            department_elem.parent().after('<tr><th class="noborder" name="parent" data-val="' + vac[i]['parent'] + '"></th><th style="display: none" class="noborder" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '"></th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                        else
                            parent_elem.parent().after('<tr><th class="noborder" name="parent" data-val="' + vac[i]['parent'] + '"></th><th style="display: none" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                    }
                    else
                        tbody.prepend('<tr><th class="tspace" colspan="4" style="border-top: none; padding-top: 20px"></tr><tr class="jobs-container-ti"><th style="padding-top: 30px;" class="jobs-container-tit" name="parent" data-val="' + vac[i]['parent'] + '">' + vac[i]['parent'] + '</th><th style="padding-top: 30px; display: none" name="department" data-val="' + vac[i]['parent'] + ' - ' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" style="padding-top: 30px;" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th style="padding-top: 30px;" name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                }
                else
                {
                    department_elem = $('.jobs-container table tbody tr th[name="department"][data-val="' + vac[i]['department'] + '"]').first();
                    if (department_elem.length)
                    {
                        department_elem.parent().after('<tr><th name="parent" data-val="0" class="noborder"></th><th style="display: none" class="noborder" name="department" data-val="' + vac[i]['department'] + '"></th><th colspan="2" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                    }
                    else
                    {
                        tbody.append('<tr><th class="tspace" colspan="4" style="border-top: none; padding-top: 20px"></tr><tr class="jobs-container-ti"><th style="padding-top: 30px;" class="jobs-container-tit" name="department" data-val="' + vac[i]['department'] + '">' + vac[i]['department'] + '</th><th colspan="2" style="padding-top: 30px;" name="title" data-val="' + vac[i]['title'] + '"><a href="' + vac[i]['url'] + '">' + vac[i]['title'] + '</a></th><th style="padding-top: 30px;" name="location" data-val="' + vac[i]['location'] + '">' + vac[i]['location'] + '</th></tr>');
                    }
                }
            }
            $('.jobs-container table tbody tr').each(function (index, elem){
                if (($.trim($(elem).children('th[name="department"]').attr('data-val')) == depvalue || depvalue == "0" || $.trim($(elem).children('th[name="parent"]').attr('data-val')) == depvalue) && ($.trim($(elem).children('th[name="location"]').attr('data-val')) == ofvalue || ofvalue == "0"))
                    $(elem).css('display', 'table-row');
                else
                {
                    if ($.trim($(elem).children('th[name="department"]').html()) != "")
                    {
                        index_1 = index + 1;
                        if ($('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="department"][data-val="' + $(elem).children('th[name="department"]').attr('data-val') + '"]').length)
                        {
                            if($('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="department"][data-val="' + $(elem).children('th[name="department"]').attr('data-val') + '"]').prev('th[name="parent"][data-val="0"]').length)
                            {
                                $('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="department"][data-val="' + $(elem).children('th[name="department"]').attr('data-val') + '"]').prev('th[name="parent"][data-val="0"]').remove();
                                $('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="department"][data-val="' + $(elem).children('th[name="department"]').attr('data-val') + '"]').attr('colspan', '2');
                                $('.jobs-container table tbody tr:eq(' + index_1 + ')').children().css('padding-top', '50px');
                            }
                            $('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="department"][data-val="' + $(elem).children('th[name="department"]').attr('data-val') + '"]').html($.trim($(elem).children('th[name="department"]').html()));
                        }
                    }
                    if ($.trim($(elem).children('th[name="parent"]').html()) != "")
                    {
                        index_1 = index + 1;
                        if ($('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="parent"][data-val="' + $(elem).children('th[name="parent"]').attr('data-val') + '"]').length)
                        {
                            $('.jobs-container table tbody tr:eq(' + index_1 + ')').children('th[name="parent"][data-val="' + $(elem).children('th[name="parent"]').attr('data-val') + '"]').html($.trim($(elem).children('th[name="parent"]').html()));
                            $('.jobs-container table tbody tr:eq(' + index_1 + ')').children().css('padding-top', '50px');
                        }
                    }          
                    $(elem).css('display', 'none');
                }
            });
        },
        error: function () {
            alert('no');
        }
    });
}

function drop(elem) {
    $('.dropdown-' + elem + ' .dropdown-child').toggleClass('dropdown-hidden');
}
function depart(elem){
    $('.dropdown-departments .selected .sel-text').html($(elem).html());
    $('.dropdown-departments .selected').attr('data-val', $(elem).attr('data-val'));
    depchange();
}
function offic(elem){
    $('.dropdown-offices .selected .sel-text').html($(elem).html());
    $('.dropdown-offices .selected').attr('data-val', $(elem).attr('data-val'));
    depchange();
}
$('body').append('<style>[name="location"]{color: #676767}[name="parent"], [name="department"]{text-transform: uppercase, color: #1a1a1a;}.highlight h1 {font-family: "Chronicle Display A","Chronicle Display B";font-size: 70px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 77px;letter-spacing: 1.8px;text-align: left;color: #fff;margin: 20px 0;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}.sel-text{text-decoration: underline}.sel-text sup {text-decoration: none;display: inline-block;}.table a {color: #1a1a1a!important}.highlight .container {top: 80%!important; text-align: left}.noborder {border-top: none!important;}.seld:hover {cursor: pointer;}.seld {appearance: none;-webkit-appearance: none;-moz-appearance: none;border: none;/* needed for Firefox: */overflow:hidden;font-size: 130%;text-decoration: underline;max-width: 187px;}.jobs-container-ti {border-top: 1px solid #d1d1d1;}.dropdown {position: relative;display: inline-block;}.dropdown:hover {cursor: pointer;}.dropdown-child {position: absolute;background-color: #ececec;min-width: 300px;margin-top: 22px;z-index: 100; font-size: 20px!important}.dropdown-child span {padding: 10px;display: block;text-align: left;}.dropdown-child span:hover {text-decoration: underline;}.dropdown-hidden {display: none;}@media only screen and (max-width: 991px) {.job-container-t {display: none;}.table {width:100%;font-family: "Graphik Web",sans-serif;}.table th{width:100%;float: left;text-align: center;}.table tr{border: none;display:block;margin-bottom:30px;}.jobs-container-tit {border-top: 1px solid #d1d1d1!important;font-size: 120%;}.jobs-container-ti {border-top: 1px solid #d1d1d1;}.dropdown-hidden {padding: 10px;position: absolute;background-color: white;border: 1px solid grey;}.dropdown-child {position: fixed;top: 62px;left: 0;width: 100%;height: 100%;overflow-y: scroll;z-index: 20;margin-top: 0}.jobs-select {font-size: 20px!important;margin-top: -128px!important}.jobs-pretext{margin-bottom: 160px!important;text-align: center;}.jobs-pretext span {width: auto!important}}</style>');