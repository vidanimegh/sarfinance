<?php
	
	function IsInjected($str)
	{
	    $injections = array('(\n+)',
	           '(\r+)',
	           '(\t+)',
	           '(%0A+)',
	           '(%0D+)',
	           '(%08+)',
	           '(%09+)'
	           );
	                
	    $inject = join('|', $injections);
	    $inject = "/$inject/i";
	     
	    if(preg_match($inject,$str))
	    {
	      return true;
	    }
	    else
	    {
	      return false;
	    }
	}
 

	$from_email = "visitor@sarfinance.com";
	$to_email = "contact@sarfinance.com";
	$visitor_email = $_POST["email"];
	$visitor_name = $_POST["name"];
	$visitor_comments = $_POST["comment"];

	$headers = "From: $from_email \r\n";
	$headers .= "Reply-To: $visitor_email \r\n";
	$headers .= "Mime-Version: 1.0\r\n";
	$headers .= "X-Mailer: PHP/".phpversion()."\r\n";

	$email_subject = "New Contact email";
	$email_body = "You have received a new mail from a website visitor $visitor_name.\n".
					"Here is the Message:\n $visitor_comments";

	if(IsInjected($visitor_email))
	{
	    echo "Bad email value!";
	    exit;
	}
	else {
		mail($to_email, $email_subject, $email_body, $headers);
		echo '<script language="javascript">';
		echo 'alert("message successfully sent")';
		echo '</script>';
	}
?>