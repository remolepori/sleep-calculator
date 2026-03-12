<?php
/**
 * Plugin Name: Schlafrechner
 * Plugin URI:  https://github.com/remolepori
 * Description: Berechne deine optimale Aufwach- oder Schlafenszeit basierend auf Schlafzyklen. Einbindung via Shortcode [schlafrechner].
 * Version:     1.0.0
 * Author:      Remo Lepori
 * Author URI:  https://github.com/remolepori
 * License:     GPL-2.0+
 * Text Domain: schlafrechner
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'SCHLAFRECHNER_VERSION', '1.0.0' );
define( 'SCHLAFRECHNER_PATH', plugin_dir_path( __FILE__ ) );
define( 'SCHLAFRECHNER_URL',  plugin_dir_url( __FILE__ ) );

/**
 * Enqueue CSS + JS only on pages that contain the shortcode.
 */
function schlafrechner_enqueue_assets() {
    global $post;
    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'schlafrechner' ) ) {
        wp_enqueue_style(
            'schlafrechner-fonts',
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap',
            [],
            null
        );
        wp_enqueue_style(
            'schlafrechner-style',
            SCHLAFRECHNER_URL . 'assets/schlafrechner.css',
            [],
            SCHLAFRECHNER_VERSION
        );
        wp_enqueue_script(
            'schlafrechner-script',
            SCHLAFRECHNER_URL . 'assets/schlafrechner.js',
            [],
            SCHLAFRECHNER_VERSION,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'schlafrechner_enqueue_assets' );

/**
 * Shortcode [schlafrechner]
 */
function schlafrechner_shortcode() {
    ob_start();
    include SCHLAFRECHNER_PATH . 'templates/widget.php';
    return ob_get_clean();
}
add_shortcode( 'schlafrechner', 'schlafrechner_shortcode' );
