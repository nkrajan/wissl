/* This file is part of Wissl - Copyright (C) 2012 Mathieu Schnoor
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*global $, localStorage, player, window, document, console, History */

var wsl = wsl || {};

(function (wsl) {
	'use strict';

	wsl.confirmDialog = function (title, message, okCallback, cancelCallback) {
		var dialog, winW, winH, w, h;
		dialog = $('#confirm-dialog');
		winW = $(window).width();
		winH = $(window).height();
		w = 400;
		h = 300;

		dialog.css('left', (winW - w) / 2);
		dialog.css('top', (winH - h) / 2);
		dialog.width(w);
		$('#confirm-dialog-title').html(title);
		$('#confirm-dialog-message').html(message);

		dialog.show();
		$('#dialog-mask').show();

		$('#confirm-dialog-ok').on('click', function () {
			$('#dialog-mask').hide();
			$('#confirm-dialog').hide();
			okCallback();
			$('#confirm-dialog-ok').off();
			$('#confirm-dialog-cancel').off();
		});
		$('#confirm-dialog-cancel').on('click', function () {
			$('#dialog-mask').hide();
			$('#confirm-dialog').hide();
			cancelCallback();
			$('#confirm-dialog-ok').off();
			$('#confirm-dialog-cancel').off();
		});
	};

	wsl.ajaxError = function (message, xhr, errorElementId) {
		var errorMsg, status, e = null;
		errorMsg = message;
		status = xhr.status;
		try {
			e = $.parseJSON(xhr.responseText);
		} catch (exc) {
			console.log('Failed to parse JSON:', exc);
		}

		console.log(xhr, xhr.responseText, status);
		if (e) {
			errorMsg = "<strong>Error " + status + "</strong><br>";
			errorMsg += message + ": " + e.message;
		} else {
			errorMsg = "Could not connect to server";
		}
		if (status === 0 || status === 401 || status === 503) {
			if (errorElementId) {
				$('#' + errorElementId).html(errorMsg).show();
			} else {
				wsl.fatalError(errorMsg);
			}
		} else {
			if (errorElementId) {
				$('#' + errorElementId).html(errorMsg).show();
			} else {
				wsl.error(errorMsg);
			}
			if (wsl.pageLoaded === false) {
				wsl.displayArtists();
			}
		}
	};

	wsl.error = function (message) {
		wsl.unlockUI();
		$("#error-dialog-message").html(message);
		wsl.showDialog('error-dialog');
	};

	wsl.fatalError = function (message) {
		player.stop();
		wsl.sessionId = null;
		wsl.userId = null;
		wsl.admin = false;

		localStorage.removeItem('sessionId');
		localStorage.removeItem('userId');
		localStorage.removeItem('auth');

		$("#login").show();
		$("#login-error").show().html(message);
	};

	wsl.closeError = function () {
		$('#dialog-mask').hide();
		$("#error-dialog").hide();
	};

	wsl.formatSeconds = function (seconds, alt) {
		var hou, min, sec, ret;

		hou = Math.floor(seconds / 3600);
		seconds -= (hou * 3600);
		min = Math.floor(seconds / 60);
		sec = Math.floor(seconds % 60);

		if (alt) {
			ret = (hou > 0 ? hou + 'h ' : '');
			ret += (min > 0 ? min + 'm ' : '');
			ret += sec + 's';
		} else {
			ret = (hou > 0 ? hou + ':' : '');
			ret += (min < 10 && hou > 0 ? '0' : '') + min + ':';
			ret += (sec < 10 ? '0' : '') + sec;
		}
		return ret;
	};

	wsl.closeAbout = function () {
		$('#dialog-mask').hide();
		$("#about-dialog").hide();
	};

	wsl.lockUI = function () {
		wsl.uiLock = true;
		$('#uilock').show();
	};

	wsl.unlockUI = function () {
		$('#uilock').hide();
		wsl.uiLock = false;
		$('#navbar').show();
	};

	wsl.showDialog = function (id) {
		var dialog, winW, winH, w, h;
		dialog = $('#' + id);
		winW = $(window).width();
		winH = $(window).height();
		w = 400;
		h = 300;

		dialog.css('left', (winW - w) / 2);
		dialog.css('top', (winH - h) / 2);
		dialog.width(w);

		$('#dialog-mask').show();
		dialog.show();
	};

}(wsl));
