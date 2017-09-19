<?php
	error_reporting(E_ALL^E_NOTICE);

    $obj->_id = "57ee7d7253411848528b4567";
    $obj->id = 2;
    $obj->goods_name = "爱奇果 陕西眉县 徐香猕猴桃 12粒装 单果100-120g";
    $obj->shop_id= 1;
    $obj->first_cate_id= 1;
    $obj->second_cate_id= 0;
    $obj->is_real= 1;
    $obj->is_advance= 0;
    $obj->advance_send_begintime= "0000-00-00 00=00=00";
    $obj->advance_send_endtime= "0000-00-00 00=00=00";
    $obj->advance_endtime= "0000-00-00 00=00=00";
    $obj->is_privilege= 0;
    $obj->is_member_discount= false;
    $obj->purchase_limit= 0;
    $obj->picture= array("http://img13.360buyimg.com/n1/jfs/t3655/151/1971152678/274261/fb508f8c/5840d683Na2190edd.jpg","http://img13.360buyimg.com/n1/jfs/t3619/270/2066693637/130324/872511e6/583b993cNf8b30bcd.jpg","http://img13.360buyimg.com/n1/jfs/t3988/154/78996704/392074/4a9edd9f/583b993cN1f0f62d1.jpg","http://img13.360buyimg.com/n1/jfs/t3370/315/1984719501/142392/2f47d380/583b993cN67ee086a.jpg",);
    $obj->goods_price= 0.01;
    $obj->cost_price= 12;
    $obj->market_price= 34;
    $obj->delivery= 0;
    $obj->delivery_id= 0;
    $obj->supplier_id= 0;
    $obj->related_products= array();
    $obj->goods_detail= '<p><img src="http://img13.360buyimg.com/n1/jfs/t3619/270/2066693637/130324/872511e6/583b993cNf8b30bcd.jpg"/><img src="http://img13.360buyimg.com/n1/jfs/t3988/154/78996704/392074/4a9edd9f/583b993cN1f0f62d1.jpg" title="1475890246934902.jpg" alt="2.jpg"/><img src="http://img13.360buyimg.com/n1/jfs/t3370/315/1984719501/142392/2f47d380/583b993cN67ee086a.jpg" title="1475890251162294.jpg" alt="3.jpg"/></p>';
	$obj->spec = array(array(spec_id=> 4,spec_name=> "尺寸",value=>array(array(value_id=> 4,value_text=> "S",imgUrl=> ""),array(value_id=> 3,value_text=> "L",imgUrl=> ""))),array(spec_id=> 2,spec_name=> "口味",value=>array(array(value_id=> 2,value_text=> "咸",imgUrl=> ""),array(value_id=> 1,value_text=> "甜",imgUrl=> ""))));
	$obj->stock = array(
		array(stock_id=> 7,stock_price=> 0.4,stock_num=> 0,stock_spec_str=> "4;2",stock_spec=> array(array(spec_id=> 4,spec_name=> "尺寸",value_id=> 4,value_text=> "S"),array(spec_id=> 2,spec_name=> "口味",value_id=> 2,value_text=> "咸")),sold_num=> 2),
		array(stock_id=> 8,stock_price=> 0.03,stock_num=> 0,stock_spec_str=> "4;1",stock_spec=> array(array(spec_id=> 4,spec_name=> "尺寸",value_id=> 4,value_text=> "S"),array(spec_id=> 2,spec_name=> "口味",value_id=> 1,value_text=> "甜")),sold_num=> 2),
		array(stock_id=> 9,stock_price=> 0.02,stock_num=> 8,stock_spec_str=> "3;2",stock_spec=> array(array(spec_id=> 4,spec_name=> "尺寸",value_id=> 3,value_text=> "L"),array(spec_id=> 2,spec_name=> "口味",value_id=> 2,value_text=> "咸")),sold_num=> 4),
		array(stock_id=> 10,stock_price=> 0.01,stock_num=> 8,stock_spec_str=> "3;1",stock_spec=> array(array(spec_id=> 4,spec_name=> "尺寸",value_id=> 3,value_text=> "L"),array(spec_id=> 2,spec_name=> "口味",value_id=> 1,value_text=> "甜")),sold_num=> 3)
	);

	

    $obj->stock_show= false;
    $obj->published_time= "2016-11-22 17=49=50";
    $obj->goods_status= 2;
    $obj->related_info= array();
    $obj->goods_image= "http://iasimg.cccwei.com/info_manager/2016/09/30/banner1.jpg";
    $obj->total_stock= 16;
    $obj->sold_count= 11;
    $obj->cover= "";
    $obj->goods_code= "";
    $obj->published_time_num= 1479808190;

	echo json_encode($obj);

?>