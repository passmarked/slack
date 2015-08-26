# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 8080, host: 8080

  config.vm.provider :virtualbox do |vb|
    vb.gui = true
    vb.customize ["modifyvm", :id, "--hwvirtex", "on"]
  end

  config.vm.provision "docker" do |d|
    d.build_image "/vagrant", args: "-t passmarked-slack:latest"
    d.run "passmarked-slack"
  end

end
