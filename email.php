<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Input fields ko clean/sanitize karein
    $name    = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone   = htmlspecialchars(strip_tags(trim($_POST['phone'] ?? '')));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

    // Destination email
    $to = "utlimatecgi@gmail.com"; 
    
    $subject = "New Contact Form Submission - Ultimate CGI";

    // Email Body Format
    $email_content  = "You have received a new message from your website contact form:\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Contact Number: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    // Email Headers (Sender email standard format mein)
    $headers  = "From: webmaster@devedenspell.com" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send Mail
    if (mail($to, $subject, $email_content, $headers)) {
        echo "<script>
                alert('Thank you! Your message has been sent successfully.');
                window.location.href = 'contact.html';
              </script>";
    } else {
        echo "<script>
                alert('Sorry, something went wrong and we couldn\'t send your message.');
                window.location.href = 'contact.html';
              </script>";
    }
} else {
    // Direct access par redirect karein
    header("Location: contact.html");
    exit;
}
?>