/**
 * Created by ypalaguta on 20.11.2017.
 */
$(function () {
    $('#sf_check').on('change', filterFlds);
    $('#sel1').on('change', filterFlds);
});

function getFilters() {
    var filters = [];
    if($('#sf_check').prop('checked'))
        filters.push('el.find("td:eq(3)").text() == "EU (RU)-Свежеватель Душ"');
    if($('#sel1').val() != "--")
        filters.push('el.find("td:eq(0) a").hasClass($("#sel1").val())');
    return filters;
}

function filterFlds() {
    var filters = getFilters();
    $("table.characters tbody tr").each(function (num, el) {
        el = $(el);
        var showItem = true;
        // console.log(filters);
        for(var item in filters) {
            // console.log(eval(filters[item]) + " _ "+ filters[item] + " _ " + el.find("td:eq(3)").text());
            showItem &= eval(filters[item]);
        }
        if(showItem)
            el.show();
        else
            el.hide();
    });
}
