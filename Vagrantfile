# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 5000, host: 5000, auto_correct: true

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--hwvirtex", "on"]
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
    vb.gui = true
  end

  # config.vm.provision "docker" do |d|
  #   d.build_image "/vagrant", args: "-t passmarked-slack"
  #   d.run "passmarked-slack", args: "-d -p 8080:8080 -i -t"
  # end

  config.vm.provision "fix-no-tty", type: "shell" do |s|
    s.privileged = false
    s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
  end

  config.vm.provision "setup", type: "shell" do |s|
    s.path = "scripts/build.sh"
    s.keep_color = true
  end

end
