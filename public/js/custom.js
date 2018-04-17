$(document).on('click', '#plus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());
    
    priceValue = priceValue + parseFloat($('#priceHidden').val());
    quantity++;
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue);
    $('#total').html(quantity);
});

$(document).on('click', '#minus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());
    if(quantity == 1)
        {
            priceValue = $('#priceHidden').val();
            quantity = 1;
        }
    else
        {
            priceValue = priceValue - parseFloat($('#priceHidden').val());
            quantity--;
        }
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue);
    $('#total').html(quantity);
});